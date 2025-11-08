"""
Modelos de Base de Datos - Sistema ICFES
"""
from datetime import datetime
from app.extensions import db
import bcrypt


class Role(db.Model):
    """Modelo de Roles (Estudiante, Docente, Admin)"""
    __tablename__ = 'roles'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)  # 'estudiante', 'docente', 'admin'
    description = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    users = db.relationship('User', backref='role', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }


class User(db.Model):
    """Modelo de Usuarios"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    document_type = db.Column(db.String(20))  # CC, TI, etc.
    document_number = db.Column(db.String(50))
    birth_date = db.Column(db.Date)
    institution = db.Column(db.String(200))  # Institución educativa
    grade = db.Column(db.String(20))  # Grado escolar
    avatar_url = db.Column(db.String(500))
    is_active = db.Column(db.Boolean, default=True)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)
    tutor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # ID del docente tutor
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Relaciones
    exams = db.relationship('Exam', backref='student', lazy=True, foreign_keys='Exam.student_id')
    progress = db.relationship('Progress', backref='user', lazy=True, cascade='all, delete-orphan')
    notifications = db.relationship('Notification', backref='user', lazy=True, cascade='all, delete-orphan')
    
    # Relación de tutoría
    tutor = db.relationship('User', remote_side=[id], backref='tutored_students', foreign_keys=[tutor_id])
    
    def set_password(self, password):
        """Encriptar contraseña"""
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        """Verificar contraseña"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def to_dict(self, include_sensitive=False):
        data = {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': f"{self.first_name} {self.last_name}",
            'phone': self.phone,
            'document_type': self.document_type,
            'document_number': self.document_number,
            'birth_date': self.birth_date.isoformat() if self.birth_date else None,
            'institution': self.institution,
            'grade': self.grade,
            'avatar_url': self.avatar_url,
            'is_active': self.is_active,
            'role': self.role.to_dict() if self.role else None,
            'tutor_id': self.tutor_id,
            'tutor': {
                'id': self.tutor.id,
                'full_name': f"{self.tutor.first_name} {self.tutor.last_name}",
                'email': self.tutor.email
            } if self.tutor else None,
            'created_at': self.created_at.isoformat(),
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
        return data


class Subject(db.Model):
    """Modelo de Materias (Matemáticas, Lectura Crítica, etc.)"""
    __tablename__ = 'subjects'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    icon = db.Column(db.String(50))  # Icono para UI
    color = db.Column(db.String(20))  # Color hexadecimal
    order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    topics = db.relationship('Topic', backref='subject', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'icon': self.icon,
            'color': self.color,
            'order': self.order,
            'is_active': self.is_active,
            'total_topics': len(self.topics)
        }


class Topic(db.Model):
    """Modelo de Temas dentro de cada materia"""
    __tablename__ = 'topics'
    
    id = db.Column(db.Integer, primary_key=True)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    difficulty = db.Column(db.String(20))  # 'facil', 'medio', 'dificil'
    order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    questions = db.relationship('Question', backref='topic', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'subject_id': self.subject_id,
            'name': self.name,
            'description': self.description,
            'difficulty': self.difficulty,
            'order': self.order,
            'is_active': self.is_active,
            'total_questions': len(self.questions)
        }


class Question(db.Model):
    """Modelo de Preguntas del banco ICFES"""
    __tablename__ = 'questions'
    
    id = db.Column(db.Integer, primary_key=True)
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    question_type = db.Column(db.String(50), default='multiple_choice')  # multiple_choice, true_false, etc.
    option_a = db.Column(db.Text)
    option_b = db.Column(db.Text)
    option_c = db.Column(db.Text)
    option_d = db.Column(db.Text)
    correct_answer = db.Column(db.String(1), nullable=False)  # A, B, C, D
    explanation = db.Column(db.Text)  # Explicación de la respuesta correcta
    difficulty = db.Column(db.String(20))
    image_url = db.Column(db.String(500))
    points = db.Column(db.Integer, default=1)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self, include_answer=False):
        data = {
            'id': self.id,
            'topic_id': self.topic_id,
            'question_text': self.question_text,
            'question_type': self.question_type,
            'options': {
                'A': self.option_a,
                'B': self.option_b,
                'C': self.option_c,
                'D': self.option_d
            },
            'difficulty': self.difficulty,
            'image_url': self.image_url,
            'points': self.points
        }
        
        if include_answer:
            data['correct_answer'] = self.correct_answer
            data['explanation'] = self.explanation
        
        return data


class Exam(db.Model):
    """Modelo de Exámenes/Simulacros realizados"""
    __tablename__ = 'exams'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    exam_type = db.Column(db.String(50), nullable=False)  # 'practice', 'simulacro', 'exam'
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'))
    title = db.Column(db.String(200), nullable=False)
    total_questions = db.Column(db.Integer, nullable=False)
    time_limit = db.Column(db.Integer)  # Tiempo en minutos
    start_time = db.Column(db.DateTime, default=datetime.utcnow)
    end_time = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='in_progress')  # 'in_progress', 'completed', 'abandoned'
    score = db.Column(db.Float)
    percentage = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    answers = db.relationship('ExamAnswer', backref='exam', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, include_answers=False):
        data = {
            'id': self.id,
            'student_id': self.student_id,
            'exam_type': self.exam_type,
            'subject_id': self.subject_id,
            'title': self.title,
            'total_questions': self.total_questions,
            'time_limit': self.time_limit,
            'start_time': self.start_time.isoformat(),
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'status': self.status,
            'score': self.score,
            'percentage': self.percentage,
            'created_at': self.created_at.isoformat()
        }
        
        if include_answers:
            data['answers'] = [answer.to_dict() for answer in self.answers]
        
        return data


class ExamAnswer(db.Model):
    """Modelo de Respuestas de exámenes"""
    __tablename__ = 'exam_answers'
    
    id = db.Column(db.Integer, primary_key=True)
    exam_id = db.Column(db.Integer, db.ForeignKey('exams.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)
    user_answer = db.Column(db.String(1))  # A, B, C, D o NULL si no respondió
    is_correct = db.Column(db.Boolean)
    points_earned = db.Column(db.Integer, default=0)
    time_spent = db.Column(db.Integer)  # Segundos
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    question = db.relationship('Question', backref='exam_answers')
    
    def to_dict(self):
        return {
            'id': self.id,
            'exam_id': self.exam_id,
            'question_id': self.question_id,
            'user_answer': self.user_answer,
            'is_correct': self.is_correct,
            'points_earned': self.points_earned,
            'time_spent': self.time_spent,
            'question': self.question.to_dict(include_answer=True) if self.question else None
        }


class Progress(db.Model):
    """Modelo de Progreso del estudiante"""
    __tablename__ = 'progress'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'), nullable=False)
    total_points = db.Column(db.Integer, default=0)
    level = db.Column(db.Integer, default=1)
    streak_days = db.Column(db.Integer, default=0)  # Racha de días estudiando
    last_activity = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    subject = db.relationship('Subject', backref='progress')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'subject': self.subject.to_dict() if self.subject else None,
            'total_points': self.total_points,
            'level': self.level,
            'streak_days': self.streak_days,
            'last_activity': self.last_activity.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class Notification(db.Model):
    """Modelo de Notificaciones"""
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50))  # 'info', 'success', 'warning', 'exam'
    is_read = db.Column(db.Boolean, default=False)
    link = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'message': self.message,
            'type': self.type,
            'is_read': self.is_read,
            'link': self.link,
            'created_at': self.created_at.isoformat()
        }


class Grade(db.Model):
    """Modelo de Calificaciones y retroalimentación del docente"""
    __tablename__ = 'grades'
    
    id = db.Column(db.Integer, primary_key=True)
    exam_id = db.Column(db.Integer, db.ForeignKey('exams.id'), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    score = db.Column(db.Float, nullable=False)
    feedback = db.Column(db.Text)
    strengths = db.Column(db.Text)  # Fortalezas
    improvements = db.Column(db.Text)  # Áreas de mejora
    status = db.Column(db.String(20), default='pending')  # 'pending', 'reviewed', 'approved'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    exam = db.relationship('Exam', backref='grades')
    teacher = db.relationship('User', backref='grades_given', foreign_keys=[teacher_id])
    
    def to_dict(self):
        return {
            'id': self.id,
            'exam_id': self.exam_id,
            'teacher_id': self.teacher_id,
            'score': self.score,
            'feedback': self.feedback,
            'strengths': self.strengths,
            'improvements': self.improvements,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class Message(db.Model):
    """Modelo de Mensajes entre tutor y estudiante"""
    __tablename__ = 'messages'
    
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    subject = db.Column(db.String(200))
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    read_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    sender = db.relationship('User', foreign_keys=[sender_id], backref='messages_sent')
    receiver = db.relationship('User', foreign_keys=[receiver_id], backref='messages_received')
    
    def to_dict(self):
        return {
            'id': self.id,
            'sender': {
                'id': self.sender.id,
                'full_name': f"{self.sender.first_name} {self.sender.last_name}",
                'email': self.sender.email
            } if self.sender else None,
            'receiver': {
                'id': self.receiver.id,
                'full_name': f"{self.receiver.first_name} {self.receiver.last_name}",
                'email': self.receiver.email
            } if self.receiver else None,
            'subject': self.subject,
            'message': self.message,
            'is_read': self.is_read,
            'read_at': self.read_at.isoformat() if self.read_at else None,
            'created_at': self.created_at.isoformat()
        }


class Task(db.Model):
    """Modelo de Tareas asignadas por el tutor al estudiante"""
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    tutor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'))
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    due_date = db.Column(db.DateTime)
    priority = db.Column(db.String(20), default='medium')  # 'low', 'medium', 'high'
    status = db.Column(db.String(20), default='pending')  # 'pending', 'in_progress', 'completed', 'overdue'
    completion_note = db.Column(db.Text)
    completed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    tutor = db.relationship('User', foreign_keys=[tutor_id], backref='tasks_assigned')
    student = db.relationship('User', foreign_keys=[student_id], backref='tasks_received')
    subject = db.relationship('Subject', backref='tasks')
    
    def to_dict(self):
        return {
            'id': self.id,
            'tutor': {
                'id': self.tutor.id,
                'full_name': f"{self.tutor.first_name} {self.tutor.last_name}"
            } if self.tutor else None,
            'student': {
                'id': self.student.id,
                'full_name': f"{self.student.first_name} {self.student.last_name}"
            } if self.student else None,
            'subject': self.subject.to_dict() if self.subject else None,
            'title': self.title,
            'description': self.description,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'priority': self.priority,
            'status': self.status,
            'completion_note': self.completion_note,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
