"""
Rutas de Administración - Sistema ICFES
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import User, Grade, Exam, Subject, Topic, Question

admin_bp = Blueprint('admin', __name__)


def require_teacher(f):
    """Decorator para requerir rol de docente"""
    def decorated_function(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user.role.name != 'docente':
            return jsonify({'error': 'Acceso denegado. Se requiere rol de docente'}), 403
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function


@admin_bp.route('/grade-exam', methods=['POST'])
@jwt_required()
@require_teacher
def grade_exam():
    """Calificar y dar retroalimentación a un examen"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('exam_id'):
            return jsonify({'error': 'exam_id es requerido'}), 400
        
        exam = Exam.query.get(data['exam_id'])
        if not exam:
            return jsonify({'error': 'Examen no encontrado'}), 404
        
        # Crear o actualizar calificación
        grade = Grade.query.filter_by(exam_id=exam.id).first()
        
        if not grade:
            grade = Grade(
                exam_id=exam.id,
                teacher_id=user_id
            )
            db.session.add(grade)
        
        grade.score = data.get('score', exam.score)
        grade.feedback = data.get('feedback')
        grade.strengths = data.get('strengths')
        grade.improvements = data.get('improvements')
        grade.status = 'reviewed'
        
        db.session.commit()
        
        return jsonify({
            'message': 'Examen calificado exitosamente',
            'grade': grade.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error: {str(e)}'}), 500


@admin_bp.route('/students/<int:student_id>/exams', methods=['GET'])
@jwt_required()
@require_teacher
def get_student_exams(student_id):
    """Obtener exámenes de un estudiante"""
    try:
        exams = Exam.query.filter_by(student_id=student_id).order_by(Exam.created_at.desc()).all()
        
        return jsonify({
            'exams': [exam.to_dict(include_answers=True) for exam in exams],
            'total': len(exams)
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500


@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
@require_teacher
def get_stats():
    """Obtener estadísticas generales"""
    try:
        total_students = User.query.join(User.role).filter_by(name='estudiante').count()
        total_exams = Exam.query.filter_by(status='completed').count()
        pending_reviews = Exam.query.filter_by(status='completed').filter(~Exam.grades.any()).count()
        
        avg_score = db.session.query(db.func.avg(Exam.percentage)).filter_by(status='completed').scalar()
        
        return jsonify({
            'total_students': total_students,
            'total_exams': total_exams,
            'pending_reviews': pending_reviews,
            'average_score': round(avg_score, 2) if avg_score else 0
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500


# ===== RUTAS DE SUPER ADMINISTRADOR =====

def require_admin(f):
    """Decorator para requerir rol de administrador"""
    def decorated_function(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role.name != 'admin':
            return jsonify({'error': 'Acceso denegado. Se requiere rol de administrador'}), 403
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function


@admin_bp.route('/super/all-users', methods=['GET'])
@jwt_required()
@require_admin
def get_all_users():
    """Obtener todos los usuarios con información detallada (solo admin)"""
    try:
        users = User.query.order_by(User.created_at.desc()).all()
        
        users_data = []
        for user in users:
            user_dict = user.to_dict()
            
            # Agregar estadísticas adicionales
            if user.role.name == 'estudiante':
                total_exams = Exam.query.filter_by(student_id=user.id, status='completed').count()
                avg_score = db.session.query(db.func.avg(Exam.percentage)).filter_by(
                    student_id=user.id, status='completed'
                ).scalar()
                
                user_dict['stats'] = {
                    'total_exams': total_exams,
                    'average_score': round(avg_score, 2) if avg_score else 0
                }
            
            users_data.append(user_dict)
        
        return jsonify({
            'users': users_data,
            'total': len(users_data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500


@admin_bp.route('/super/users/<int:user_id>', methods=['GET'])
@jwt_required()
@require_admin
def get_user_detail(user_id):
    """Obtener detalles completos de un usuario (solo admin)"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        user_data = user.to_dict(include_sensitive=True)
        
        # Agregar estadísticas completas
        if user.role.name == 'estudiante':
            exams = Exam.query.filter_by(student_id=user.id).order_by(Exam.created_at.desc()).all()
            progress = Progress.query.filter_by(user_id=user.id).all()
            
            user_data['exams'] = [exam.to_dict() for exam in exams]
            user_data['progress'] = [prog.to_dict() for prog in progress]
        
        return jsonify(user_data), 200
        
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500


@admin_bp.route('/super/users/<int:user_id>/toggle-status', methods=['PATCH'])
@jwt_required()
@require_admin
def toggle_user_status(user_id):
    """Activar/Desactivar usuario (solo admin)"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        user.is_active = not user.is_active
        db.session.commit()
        
        return jsonify({
            'message': f'Usuario {"activado" if user.is_active else "desactivado"} exitosamente',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error: {str(e)}'}), 500


@admin_bp.route('/super/users/<int:user_id>/change-role', methods=['PATCH'])
@jwt_required()
@require_admin
def change_user_role(user_id):
    """Cambiar rol de usuario (solo admin)"""
    try:
        data = request.get_json()
        role_id = data.get('role_id')
        
        if not role_id:
            return jsonify({'error': 'role_id es requerido'}), 400
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        from app.models import Role
        role = Role.query.get(role_id)
        if not role:
            return jsonify({'error': 'Rol no encontrado'}), 404
        
        user.role_id = role_id
        db.session.commit()
        
        return jsonify({
            'message': 'Rol actualizado exitosamente',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error: {str(e)}'}), 500


@admin_bp.route('/super/stats', methods=['GET'])
@jwt_required()
@require_admin
def get_super_stats():
    """Obtener estadísticas completas del sistema (solo admin)"""
    try:
        from app.models import Role
        
        total_users = User.query.count()
        total_students = User.query.join(User.role).filter_by(name='estudiante').count()
        total_teachers = User.query.join(User.role).filter_by(name='docente').count()
        total_admins = User.query.join(User.role).filter_by(name='admin').count()
        active_users = User.query.filter_by(is_active=True).count()
        inactive_users = User.query.filter_by(is_active=False).count()
        
        total_subjects = Subject.query.count()
        total_topics = Topic.query.count()
        total_questions = Question.query.count()
        total_exams = Exam.query.count()
        completed_exams = Exam.query.filter_by(status='completed').count()
        
        avg_score = db.session.query(db.func.avg(Exam.percentage)).filter_by(status='completed').scalar()
        
        return jsonify({
            'users': {
                'total': total_users,
                'students': total_students,
                'teachers': total_teachers,
                'admins': total_admins,
                'active': active_users,
                'inactive': inactive_users
            },
            'content': {
                'subjects': total_subjects,
                'topics': total_topics,
                'questions': total_questions
            },
            'exams': {
                'total': total_exams,
                'completed': completed_exams,
                'average_score': round(avg_score, 2) if avg_score else 0
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500
