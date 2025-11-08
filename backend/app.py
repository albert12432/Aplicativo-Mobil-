"""
Aplicación Principal - Sistema de Preparación ICFES
Backend Flask API
"""
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import config
from app.extensions import db, migrate
from app.routes import register_blueprints
import os


def create_app(config_name='development'):
    """Factory para crear la aplicación Flask"""
    
    app = Flask(__name__)
    
    # Cargar configuración
    app.config.from_object(config[config_name])
    
    # Inicializar extensiones
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config['CORS_ORIGINS'],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    JWTManager(app)
    
    # Registrar blueprints
    register_blueprints(app)
    
    # Ruta de health check
    @app.route('/health')
    def health():
        return jsonify({
            'status': 'ok',
            'message': 'Sistema ICFES API funcionando correctamente'
        }), 200
    
    # Ruta principal
    @app.route('/')
    def index():
        return jsonify({
            'message': 'Sistema de Preparación ICFES - API',
            'version': '1.0.0',
            'endpoints': {
                'auth': '/api/auth',
                'users': '/api/users',
                'subjects': '/api/subjects',
                'exams': '/api/exams',
                'progress': '/api/progress',
                'admin': '/api/admin'
            }
        }), 200
    
    # Manejo de errores global
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Recurso no encontrado'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Error interno del servidor'}), 500
    
    return app


if __name__ == '__main__':
    # Obtener configuración de entorno
    env = os.getenv('FLASK_ENV', 'development')
    app = create_app(env)
    
    # Ejecutar servidor
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', 5000))
    
    app.run(host=host, port=port, debug=app.config['DEBUG'])
