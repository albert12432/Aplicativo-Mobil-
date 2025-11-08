"""
Rutas de Usuarios - Sistema ICFES
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import User, Progress, Exam

user_bp = Blueprint('users', __name__)


@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Obtener perfil del usuario actual"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        # Estadísticas adicionales
        total_exams = Exam.query.filter_by(student_id=user_id, status='completed').count()
        progress_data = Progress.query.filter_by(user_id=user_id).all()
        total_points = sum(p.total_points for p in progress_data)
        
        profile = user.to_dict()
        profile['stats'] = {
            'total_exams': total_exams,
            'total_points': total_points,
            'subjects_in_progress': len(progress_data)
        }
        
        return jsonify(profile), 200
        
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500


@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Actualizar perfil del usuario"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        data = request.get_json()
        
        # Actualizar campos permitidos
        allowed_fields = ['first_name', 'last_name', 'phone', 'institution', 'grade', 'avatar_url']
        for field in allowed_fields:
            if field in data:
                setattr(user, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Perfil actualizado exitosamente',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error: {str(e)}'}), 500


@user_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    """Obtener información de un usuario específico"""
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500


@user_bp.route('/students', methods=['GET'])
@jwt_required()
def get_students():
    """Obtener lista de estudiantes (solo para docentes)"""
    try:
        # Verificar que sea docente
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if current_user.role.name != 'docente':
            return jsonify({'error': 'Acceso denegado'}), 403
        
        # Obtener estudiantes
        students = User.query.join(User.role).filter_by(name='estudiante').all()
        
        return jsonify({
            'students': [student.to_dict() for student in students],
            'total': len(students)
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500


@user_bp.route('/assign-tutor', methods=['POST'])
@jwt_required()
def assign_tutor():
    """Asignar un docente como tutor de un estudiante"""
    try:
        # Verificar que sea docente
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if current_user.role.name != 'docente':
            return jsonify({'error': 'Acceso denegado. Solo docentes pueden asignar tutorías'}), 403
        
        data = request.get_json()
        student_id = data.get('student_id')
        
        if not student_id:
            return jsonify({'error': 'Se requiere el ID del estudiante'}), 400
        
        # Obtener el estudiante
        student = User.query.get(student_id)
        
        if not student:
            return jsonify({'error': 'Estudiante no encontrado'}), 404
        
        if student.role.name != 'estudiante':
            return jsonify({'error': 'El usuario no es un estudiante'}), 400
        
        # Asignar el docente como tutor
        student.tutor_id = current_user_id
        db.session.commit()
        
        return jsonify({
            'message': 'Tutoría asignada exitosamente',
            'student': student.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error: {str(e)}'}), 500


@user_bp.route('/remove-tutor', methods=['POST'])
@jwt_required()
def remove_tutor():
    """Remover la asignación de tutor de un estudiante"""
    try:
        # Verificar que sea docente
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if current_user.role.name != 'docente':
            return jsonify({'error': 'Acceso denegado. Solo docentes pueden remover tutorías'}), 403
        
        data = request.get_json()
        student_id = data.get('student_id')
        
        if not student_id:
            return jsonify({'error': 'Se requiere el ID del estudiante'}), 400
        
        # Obtener el estudiante
        student = User.query.get(student_id)
        
        if not student:
            return jsonify({'error': 'Estudiante no encontrado'}), 404
        
        # Verificar que el docente actual sea el tutor
        if student.tutor_id != current_user_id:
            return jsonify({'error': 'No eres el tutor de este estudiante'}), 403
        
        # Remover la tutoría
        student.tutor_id = None
        db.session.commit()
        
        return jsonify({
            'message': 'Tutoría removida exitosamente',
            'student': student.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error: {str(e)}'}), 500


@user_bp.route('/my-tutees', methods=['GET'])
@jwt_required()
def get_my_tutees():
    """Obtener lista de estudiantes bajo mi tutoría"""
    try:
        # Verificar que sea docente
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if current_user.role.name != 'docente':
            return jsonify({'error': 'Acceso denegado'}), 403
        
        # Obtener estudiantes bajo tutoría
        tutees = User.query.filter_by(tutor_id=current_user_id).all()
        
        return jsonify({
            'students': [student.to_dict() for student in tutees],
            'total': len(tutees)
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500


@user_bp.route('/my-tutor', methods=['GET'])
@jwt_required()
def get_my_tutor():
    """Obtener información del tutor asignado (para estudiantes)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        if user.role.name != 'estudiante':
            return jsonify({'error': 'Solo estudiantes tienen tutores asignados'}), 403
        
        if not user.tutor:
            return jsonify({'tutor': None, 'message': 'No tienes tutor asignado'}), 200
        
        return jsonify({
            'tutor': {
                'id': user.tutor.id,
                'full_name': f"{user.tutor.first_name} {user.tutor.last_name}",
                'email': user.tutor.email,
                'phone': user.tutor.phone
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500
