"""
Rutas de Materias y Temas - Sistema ICFES
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models import Subject, Topic, Question

subject_bp = Blueprint('subjects', __name__)


@subject_bp.route('/', methods=['GET'])
@jwt_required()
def get_subjects():
    """Obtener todas las materias activas"""
    try:
        subjects = Subject.query.filter_by(is_active=True).order_by(Subject.order).all()
        
        return jsonify({
            'subjects': [subject.to_dict() for subject in subjects],
            'total': len(subjects)
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500


@subject_bp.route('/<int:subject_id>', methods=['GET'])
@jwt_required()
def get_subject(subject_id):
    """Obtener detalles de una materia"""
    try:
        subject = Subject.query.get(subject_id)
        
        if not subject:
            return jsonify({'error': 'Materia no encontrada'}), 404
        
        # Incluir temas
        subject_data = subject.to_dict()
        subject_data['topics'] = [topic.to_dict() for topic in subject.topics if topic.is_active]
        
        return jsonify(subject_data), 200
        
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500


@subject_bp.route('/<int:subject_id>/topics', methods=['GET'])
@jwt_required()
def get_topics(subject_id):
    """Obtener todos los temas de una materia"""
    try:
        topics = Topic.query.filter_by(subject_id=subject_id, is_active=True).order_by(Topic.order).all()
        
        return jsonify({
            'topics': [topic.to_dict() for topic in topics],
            'total': len(topics)
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500


@subject_bp.route('/topics/<int:topic_id>/questions', methods=['GET'])
@jwt_required()
def get_questions(topic_id):
    """Obtener preguntas de un tema"""
    try:
        # Parámetros de paginación
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        difficulty = request.args.get('difficulty', None)
        
        # Query base
        query = Question.query.filter_by(topic_id=topic_id, is_active=True)
        
        # Filtrar por dificultad si se especifica
        if difficulty:
            query = query.filter_by(difficulty=difficulty)
        
        # Paginación
        paginated = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'questions': [q.to_dict(include_answer=False) for q in paginated.items],
            'total': paginated.total,
            'page': page,
            'per_page': per_page,
            'pages': paginated.pages
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500
