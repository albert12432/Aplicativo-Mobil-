"""
Registro de Blueprints - Sistema ICFES
"""
from flask import Blueprint
from app.routes.auth_routes import auth_bp
from app.routes.user_routes import user_bp
from app.routes.subject_routes import subject_bp
from app.routes.exam_routes import exam_bp
from app.routes.progress_routes import progress_bp
from app.routes.admin_routes import admin_bp
from app.routes.tutoring_routes import tutoring_bp


def register_blueprints(app):
    """Registrar todos los blueprints de la aplicación"""
    
    # Autenticación
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    # Usuarios
    app.register_blueprint(user_bp, url_prefix='/api/users')
    
    # Materias y temas
    app.register_blueprint(subject_bp, url_prefix='/api/subjects')
    
    # Exámenes
    app.register_blueprint(exam_bp, url_prefix='/api/exams')
    
    # Progreso
    app.register_blueprint(progress_bp, url_prefix='/api/progress')
    
    # Administración
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    # Tutoría (mensajes y tareas)
    app.register_blueprint(tutoring_bp, url_prefix='/api/tutoring')
