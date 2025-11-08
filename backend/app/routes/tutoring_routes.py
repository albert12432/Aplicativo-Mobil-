"""
Rutas de Tutoría - Sistema ICFES
Manejo de mensajes y tareas entre tutores y estudiantes
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app.extensions import db
from app.models import User, Message, Task, Subject

tutoring_bp = Blueprint('tutoring', __name__)


# ==================== MENSAJES ====================

@tutoring_bp.route('/messages', methods=['GET'])
@jwt_required()
def get_messages():
    """Obtener mensajes del usuario actual"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        # Obtener mensajes recibidos y enviados
        received = Message.query.filter_by(receiver_id=user_id).order_by(Message.created_at.desc()).all()
        sent = Message.query.filter_by(sender_id=user_id).order_by(Message.created_at.desc()).all()
        
        # Contar mensajes no leídos
        unread_count = Message.query.filter_by(receiver_id=user_id, is_read=False).count()
        
        return jsonify({
            'received': [msg.to_dict() for msg in received],
            'sent': [msg.to_dict() for msg in sent],
            'unread_count': unread_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500


@tutoring_bp.route('/messages/conversation/<int:other_user_id>', methods=['GET'])
@jwt_required()
def get_conversation(other_user_id):
    """Obtener conversación con un usuario específico"""
    try:
        user_id = get_jwt_identity()
        
        # Obtener todos los mensajes entre ambos usuarios
        messages = Message.query.filter(
            db.or_(
                db.and_(Message.sender_id == user_id, Message.receiver_id == other_user_id),
                db.and_(Message.sender_id == other_user_id, Message.receiver_id == user_id)
            )
        ).order_by(Message.created_at.asc()).all()
        
        # Marcar como leídos los mensajes recibidos
        Message.query.filter_by(
            sender_id=other_user_id,
            receiver_id=user_id,
            is_read=False
        ).update({'is_read': True, 'read_at': datetime.utcnow()})
        db.session.commit()
        
        return jsonify({
            'messages': [msg.to_dict() for msg in messages],
            'total': len(messages)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error: {str(e)}'}), 500


@tutoring_bp.route('/messages/send', methods=['POST'])
@jwt_required()
def send_message():
    """Enviar un mensaje"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        data = request.get_json()
        receiver_id = data.get('receiver_id')
        subject = data.get('subject', '')
        message_text = data.get('message')
        
        if not receiver_id or not message_text:
            return jsonify({'error': 'Se requiere destinatario y mensaje'}), 400
        
        # Verificar que el destinatario existe
        receiver = User.query.get(receiver_id)
        if not receiver:
            return jsonify({'error': 'Destinatario no encontrado'}), 404
        
        # Verificar relación de tutoría
        if user.role.name == 'estudiante':
            if user.tutor_id != receiver_id:
                return jsonify({'error': 'Solo puedes enviar mensajes a tu tutor'}), 403
        elif user.role.name == 'docente':
            if receiver.tutor_id != user_id:
                return jsonify({'error': 'Solo puedes enviar mensajes a tus estudiantes bajo tutoría'}), 403
        
        # Crear mensaje
        message = Message(
            sender_id=user_id,
            receiver_id=receiver_id,
            subject=subject,
            message=message_text
        )
        
        db.session.add(message)
        db.session.commit()
        
        return jsonify({
            'message': 'Mensaje enviado exitosamente',
            'data': message.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error: {str(e)}'}), 500


@tutoring_bp.route('/messages/<int:message_id>/read', methods=['PUT'])
@jwt_required()
def mark_message_read(message_id):
    """Marcar un mensaje como leído"""
    try:
        user_id = get_jwt_identity()
        
        message = Message.query.get(message_id)
        if not message:
            return jsonify({'error': 'Mensaje no encontrado'}), 404
        
        if message.receiver_id != user_id:
            return jsonify({'error': 'No tienes permiso para marcar este mensaje'}), 403
        
        message.is_read = True
        message.read_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Mensaje marcado como leído',
            'data': message.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error: {str(e)}'}), 500


# ==================== TAREAS ====================

@tutoring_bp.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    """Obtener tareas del usuario actual"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        if user.role.name == 'estudiante':
            # Obtener tareas asignadas al estudiante
            tasks = Task.query.filter_by(student_id=user_id).order_by(Task.due_date.asc()).all()
        elif user.role.name == 'docente':
            # Obtener tareas creadas por el docente
            tasks = Task.query.filter_by(tutor_id=user_id).order_by(Task.due_date.asc()).all()
        else:
            return jsonify({'error': 'Rol no autorizado'}), 403
        
        # Actualizar estado de tareas vencidas
        now = datetime.utcnow()
        for task in tasks:
            if task.due_date and task.due_date < now and task.status == 'pending':
                task.status = 'overdue'
        db.session.commit()
        
        return jsonify({
            'tasks': [task.to_dict() for task in tasks],
            'total': len(tasks)
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500


@tutoring_bp.route('/tasks/create', methods=['POST'])
@jwt_required()
def create_task():
    """Crear una tarea (solo tutores)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role.name != 'docente':
            return jsonify({'error': 'Solo los docentes pueden crear tareas'}), 403
        
        data = request.get_json()
        student_id = data.get('student_id')
        title = data.get('title')
        description = data.get('description', '')
        subject_id = data.get('subject_id')
        due_date_str = data.get('due_date')
        priority = data.get('priority', 'medium')
        
        if not student_id or not title:
            return jsonify({'error': 'Se requiere estudiante y título'}), 400
        
        # Verificar que el estudiante está bajo tutoría
        student = User.query.get(student_id)
        if not student or student.tutor_id != user_id:
            return jsonify({'error': 'Solo puedes asignar tareas a tus estudiantes bajo tutoría'}), 403
        
        # Parsear fecha de vencimiento
        due_date = None
        if due_date_str:
            try:
                due_date = datetime.fromisoformat(due_date_str.replace('Z', '+00:00'))
            except:
                return jsonify({'error': 'Formato de fecha inválido'}), 400
        
        # Crear tarea
        task = Task(
            tutor_id=user_id,
            student_id=student_id,
            subject_id=subject_id,
            title=title,
            description=description,
            due_date=due_date,
            priority=priority
        )
        
        db.session.add(task)
        db.session.commit()
        
        return jsonify({
            'message': 'Tarea creada exitosamente',
            'task': task.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error: {str(e)}'}), 500


@tutoring_bp.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    """Actualizar una tarea"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        task = Task.query.get(task_id)
        if not task:
            return jsonify({'error': 'Tarea no encontrada'}), 404
        
        data = request.get_json()
        
        # Si es docente, puede actualizar cualquier campo
        if user.role.name == 'docente' and task.tutor_id == user_id:
            if 'title' in data:
                task.title = data['title']
            if 'description' in data:
                task.description = data['description']
            if 'due_date' in data:
                try:
                    task.due_date = datetime.fromisoformat(data['due_date'].replace('Z', '+00:00'))
                except:
                    pass
            if 'priority' in data:
                task.priority = data['priority']
            if 'status' in data:
                task.status = data['status']
        
        # Si es estudiante, solo puede cambiar estado y agregar nota de completación
        elif user.role.name == 'estudiante' and task.student_id == user_id:
            if 'status' in data:
                task.status = data['status']
                if data['status'] == 'completed':
                    task.completed_at = datetime.utcnow()
            if 'completion_note' in data:
                task.completion_note = data['completion_note']
        else:
            return jsonify({'error': 'No tienes permiso para modificar esta tarea'}), 403
        
        db.session.commit()
        
        return jsonify({
            'message': 'Tarea actualizada exitosamente',
            'task': task.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error: {str(e)}'}), 500


@tutoring_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    """Eliminar una tarea (solo tutor)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role.name != 'docente':
            return jsonify({'error': 'Solo los docentes pueden eliminar tareas'}), 403
        
        task = Task.query.get(task_id)
        if not task:
            return jsonify({'error': 'Tarea no encontrada'}), 404
        
        if task.tutor_id != user_id:
            return jsonify({'error': 'No tienes permiso para eliminar esta tarea'}), 403
        
        db.session.delete(task)
        db.session.commit()
        
        return jsonify({'message': 'Tarea eliminada exitosamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error: {str(e)}'}), 500
