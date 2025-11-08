"""
Rutas de Progreso - Sistema ICFES
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Progress, Subject, Notification
from datetime import datetime, timedelta

progress_bp = Blueprint('progress', __name__)


@progress_bp.route('/my-progress', methods=['GET'])
@jwt_required()
def get_my_progress():
    """Obtener progreso del usuario actual"""
    try:
        user_id = get_jwt_identity()
        
        progress_list = Progress.query.filter_by(user_id=user_id).all()
        
        return jsonify({
            'progress': [p.to_dict() for p in progress_list],
            'total_subjects': len(progress_list),
            'total_points': sum(p.total_points for p in progress_list),
            'average_level': sum(p.level for p in progress_list) / len(progress_list) if progress_list else 0
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500


@progress_bp.route('/subject/<int:subject_id>', methods=['GET'])
@jwt_required()
def get_subject_progress(subject_id):
    """Obtener progreso en una materia específica"""
    try:
        user_id = get_jwt_identity()
        
        progress = Progress.query.filter_by(user_id=user_id, subject_id=subject_id).first()
        
        if not progress:
            # Crear progreso si no existe
            subject = Subject.query.get(subject_id)
            if not subject:
                return jsonify({'error': 'Materia no encontrada'}), 404
            
            progress = Progress(
                user_id=user_id,
                subject_id=subject_id,
                total_points=0,
                level=1,
                streak_days=0
            )
            db.session.add(progress)
            db.session.commit()
        
        return jsonify({'progress': progress.to_dict()}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error: {str(e)}'}), 500


@progress_bp.route('/add-points', methods=['POST'])
@jwt_required()
def add_points():
    """Agregar puntos al progreso"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('subject_id') or not data.get('points'):
            return jsonify({'error': 'Subject ID y puntos son requeridos'}), 400
        
        progress = Progress.query.filter_by(
            user_id=user_id,
            subject_id=data['subject_id']
        ).first()
        
        if not progress:
            # Crear nuevo progreso
            progress = Progress(
                user_id=user_id,
                subject_id=data['subject_id'],
                total_points=0,
                level=1
            )
            db.session.add(progress)
        
        # Agregar puntos
        progress.total_points += data['points']
        
        # Calcular nivel (cada 100 puntos = 1 nivel)
        progress.level = (progress.total_points // 100) + 1
        
        # Actualizar racha
        now = datetime.utcnow()
        if progress.last_activity:
            diff = now - progress.last_activity
            if diff.days == 1:
                # Día consecutivo
                progress.streak_days += 1
            elif diff.days > 1:
                # Se rompió la racha
                progress.streak_days = 1
        else:
            progress.streak_days = 1
        
        progress.last_activity = now
        
        db.session.commit()
        
        return jsonify({
            'message': 'Puntos agregados exitosamente',
            'progress': progress.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error: {str(e)}'}), 500


@progress_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    """Obtener notificaciones del usuario"""
    try:
        user_id = get_jwt_identity()
        
        notifications = Notification.query.filter_by(user_id=user_id).order_by(
            Notification.created_at.desc()
        ).limit(50).all()
        
        unread_count = Notification.query.filter_by(user_id=user_id, is_read=False).count()
        
        return jsonify({
            'notifications': [n.to_dict() for n in notifications],
            'unread_count': unread_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500


@progress_bp.route('/notifications/<int:notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_notification_read(notification_id):
    """Marcar notificación como leída"""
    try:
        user_id = get_jwt_identity()
        notification = Notification.query.get(notification_id)
        
        if not notification:
            return jsonify({'error': 'Notificación no encontrada'}), 404
        
        if notification.user_id != user_id:
            return jsonify({'error': 'No tienes permiso'}), 403
        
        notification.is_read = True
        db.session.commit()
        
        return jsonify({'message': 'Notificación marcada como leída'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error: {str(e)}'}), 500
