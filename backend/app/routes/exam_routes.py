"""
Rutas de Exámenes - Sistema ICFES
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Exam, ExamAnswer, Question, User, Subject
from datetime import datetime
import random

exam_bp = Blueprint('exams', __name__)


@exam_bp.route('/create', methods=['POST'])
@jwt_required()
def create_exam():
    """Crear un nuevo examen/simulacro"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validar datos
        if not data.get('title') or not data.get('subject_id'):
            return jsonify({'error': 'Título y materia son requeridos'}), 400
        
        total_questions = data.get('total_questions', 10)
        
        # Crear examen
        exam = Exam(
            student_id=user_id,
            exam_type=data.get('exam_type', 'practice'),
            subject_id=data['subject_id'],
            title=data['title'],
            total_questions=total_questions,
            time_limit=data.get('time_limit', 60),
            status='in_progress'
        )
        
        db.session.add(exam)
        db.session.flush()  # Para obtener el ID
        
        # Seleccionar preguntas aleatorias del tema
        topic_id = data.get('topic_id')
        difficulty = data.get('difficulty')
        
        query = Question.query.filter_by(is_active=True)
        
        if topic_id:
            query = query.filter_by(topic_id=topic_id)
        else:
            # Si no hay tema específico, usar todas las preguntas de la materia
            query = query.join(Question.topic).filter_by(subject_id=data['subject_id'])
        
        if difficulty:
            query = query.filter_by(difficulty=difficulty)
        
        questions = query.all()
        
        if len(questions) < total_questions:
            db.session.rollback()
            return jsonify({'error': 'No hay suficientes preguntas disponibles'}), 400
        
        # Seleccionar preguntas aleatorias
        selected_questions = random.sample(questions, total_questions)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Examen creado exitosamente',
            'exam': exam.to_dict(),
            'questions': [q.to_dict(include_answer=False) for q in selected_questions]
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error: {str(e)}'}), 500


@exam_bp.route('/<int:exam_id>/submit', methods=['POST'])
@jwt_required()
def submit_exam(exam_id):
    """Enviar respuestas de un examen"""
    try:
        user_id = get_jwt_identity()
        exam = Exam.query.get(exam_id)
        
        if not exam:
            return jsonify({'error': 'Examen no encontrado'}), 404
        
        if exam.student_id != user_id:
            return jsonify({'error': 'No tienes permiso para este examen'}), 403
        
        if exam.status == 'completed':
            return jsonify({'error': 'Este examen ya fue completado'}), 400
        
        data = request.get_json()
        answers = data.get('answers', [])
        
        if not answers:
            return jsonify({'error': 'No se enviaron respuestas'}), 400
        
        # Procesar respuestas
        total_score = 0
        correct_answers = 0
        
        for answer_data in answers:
            question = Question.query.get(answer_data['question_id'])
            if not question:
                continue
            
            user_answer = answer_data.get('answer')
            is_correct = user_answer == question.correct_answer
            points = question.points if is_correct else 0
            
            if is_correct:
                correct_answers += 1
                total_score += points
            
            # Guardar respuesta
            exam_answer = ExamAnswer(
                exam_id=exam_id,
                question_id=question.id,
                user_answer=user_answer,
                is_correct=is_correct,
                points_earned=points,
                time_spent=answer_data.get('time_spent', 0)
            )
            db.session.add(exam_answer)
        
        # Actualizar examen
        exam.end_time = datetime.utcnow()
        exam.status = 'completed'
        exam.score = total_score
        exam.percentage = (correct_answers / exam.total_questions) * 100 if exam.total_questions > 0 else 0
        
        db.session.commit()
        
        return jsonify({
            'message': 'Examen enviado exitosamente',
            'exam': exam.to_dict(include_answers=True),
            'results': {
                'total_questions': exam.total_questions,
                'correct_answers': correct_answers,
                'score': total_score,
                'percentage': round(exam.percentage, 2)
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error: {str(e)}'}), 500


@exam_bp.route('/my-exams', methods=['GET'])
@jwt_required()
def get_my_exams():
    """Obtener exámenes del usuario actual"""
    try:
        user_id = get_jwt_identity()
        
        # Parámetros
        status = request.args.get('status')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        query = Exam.query.filter_by(student_id=user_id)
        
        if status:
            query = query.filter_by(status=status)
        
        query = query.order_by(Exam.created_at.desc())
        
        paginated = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'exams': [exam.to_dict() for exam in paginated.items],
            'total': paginated.total,
            'page': page,
            'pages': paginated.pages
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500


@exam_bp.route('/<int:exam_id>', methods=['GET'])
@jwt_required()
def get_exam(exam_id):
    """Obtener detalles de un examen"""
    try:
        user_id = get_jwt_identity()
        exam = Exam.query.get(exam_id)
        
        if not exam:
            return jsonify({'error': 'Examen no encontrado'}), 404
        
        # Verificar permiso
        user = User.query.get(user_id)
        if exam.student_id != user_id and user.role.name != 'docente':
            return jsonify({'error': 'No tienes permiso para ver este examen'}), 403
        
        # Incluir respuestas solo si está completado
        include_answers = exam.status == 'completed'
        
        return jsonify({'exam': exam.to_dict(include_answers=include_answers)}), 200
        
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500


@exam_bp.route('/pending-review', methods=['GET'])
@jwt_required()
def get_pending_exams():
    """Obtener exámenes pendientes de revisión (para docentes)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        # Solo docentes
        if user.role.name != 'docente':
            return jsonify({'error': 'Acceso denegado'}), 403
        
        # Exámenes completados sin calificación
        exams = Exam.query.filter_by(status='completed').filter(~Exam.grades.any()).all()
        
        return jsonify({
            'exams': [exam.to_dict() for exam in exams],
            'total': len(exams)
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500
