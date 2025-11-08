-- Base de Datos Sistema de Preparación ICFES
-- MySQL Database Script

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS icfes_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE icfes_db;

-- Tabla de Roles
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    document_type VARCHAR(20),
    document_number VARCHAR(50),
    birth_date DATE,
    institution VARCHAR(200),
    grade VARCHAR(20),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    INDEX idx_email (email),
    INDEX idx_role (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Materias
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    `order` INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order (`order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Temas
CREATE TABLE IF NOT EXISTS topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    difficulty VARCHAR(20),
    `order` INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    INDEX idx_subject (subject_id),
    INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Preguntas
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) DEFAULT 'multiple_choice',
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    correct_answer CHAR(1) NOT NULL,
    explanation TEXT,
    difficulty VARCHAR(20),
    image_url VARCHAR(500),
    points INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    INDEX idx_topic (topic_id),
    INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Exámenes
CREATE TABLE IF NOT EXISTS exams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    exam_type VARCHAR(50) NOT NULL,
    subject_id INT,
    title VARCHAR(200) NOT NULL,
    total_questions INT NOT NULL,
    time_limit INT,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    status VARCHAR(20) DEFAULT 'in_progress',
    score FLOAT,
    percentage FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
    INDEX idx_student (student_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Respuestas de Exámenes
CREATE TABLE IF NOT EXISTS exam_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL,
    question_id INT NOT NULL,
    user_answer CHAR(1),
    is_correct BOOLEAN,
    points_earned INT DEFAULT 0,
    time_spent INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    INDEX idx_exam (exam_id),
    INDEX idx_question (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Progreso
CREATE TABLE IF NOT EXISTS progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject_id INT NOT NULL,
    total_points INT DEFAULT 0,
    level INT DEFAULT 1,
    streak_days INT DEFAULT 0,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_subject (user_id, subject_id),
    INDEX idx_user (user_id),
    INDEX idx_subject (subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Notificaciones
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Calificaciones
CREATE TABLE IF NOT EXISTS grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL,
    teacher_id INT NOT NULL,
    score FLOAT NOT NULL,
    feedback TEXT,
    strengths TEXT,
    improvements TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_exam (exam_id),
    INDEX idx_teacher (teacher_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERCIÓN DE DATOS INICIALES
-- ============================================

-- Roles
INSERT INTO roles (name, description) VALUES
('estudiante', 'Usuario estudiante que realiza exámenes y simulacros'),
('docente', 'Usuario docente que califica y da retroalimentación'),
('admin', 'Usuario administrador del sistema');

-- Materias ICFES
INSERT INTO subjects (name, description, icon, color, `order`) VALUES
('Lectura Crítica', 'Comprensión de textos, análisis y argumentación', '📚', '#FF6B6B', 1),
('Matemáticas', 'Razonamiento cuantitativo y resolución de problemas', '🔢', '#4ECDC4', 2),
('Ciencias Naturales', 'Biología, Química, Física y Medio Ambiente', '🔬', '#95E1D3', 3),
('Ciencias Sociales', 'Historia, Geografía, Economía y Política', '🌍', '#FFE66D', 4),
('Inglés', 'Comprensión lectora y competencia comunicativa', '🌐', '#A8DADC', 5);

-- Temas de Lectura Crítica
INSERT INTO topics (subject_id, name, description, difficulty, `order`) VALUES
(1, 'Comprensión Literal', 'Identificar información explícita en el texto', 'facil', 1),
(1, 'Comprensión Inferencial', 'Deducir información implícita', 'medio', 2),
(1, 'Comprensión Crítica', 'Analizar y evaluar argumentos', 'dificil', 3);

-- Temas de Matemáticas
INSERT INTO topics (subject_id, name, description, difficulty, `order`) VALUES
(2, 'Aritmética', 'Operaciones básicas y propiedades numéricas', 'facil', 1),
(2, 'Álgebra', 'Ecuaciones, inecuaciones y funciones', 'medio', 2),
(2, 'Geometría', 'Figuras, áreas, volúmenes y teoremas', 'medio', 3),
(2, 'Estadística', 'Análisis de datos y probabilidad', 'dificil', 4);

-- Preguntas de ejemplo - Lectura Crítica
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, points) VALUES
(1, '¿Cuál es la idea principal del texto? "El cambio climático es uno de los mayores desafíos de nuestra época..."', 
'El clima está cambiando', 
'El cambio climático es un desafío importante', 
'El clima es peligroso', 
'El planeta está en peligro',
'B', 'La idea principal expresa que el cambio climático representa un gran desafío para la humanidad.', 'facil', 1);

-- Preguntas de ejemplo - Matemáticas
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, points) VALUES
(4, 'Si x + 5 = 12, ¿cuál es el valor de x?', '5', '6', '7', '17', 'C', 'Restando 5 de ambos lados: x = 12 - 5 = 7', 'facil', 1),
(5, 'Si 2x + 3 = 11, ¿cuál es el valor de x?', '2', '3', '4', '5', 'C', 'Restando 3: 2x = 8, dividiendo por 2: x = 4', 'medio', 2);

-- Usuario de prueba (Estudiante)
-- Contraseña: Estudiante123
INSERT INTO users (email, password_hash, first_name, last_name, phone, institution, grade, role_id) VALUES
('estudiante@icfes.test', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqXg.u5L.a', 'Juan', 'Pérez', '3001234567', 'Colegio Nacional', '11', 1);

-- Usuario de prueba (Docente)
-- Contraseña: Docente123
INSERT INTO users (email, password_hash, first_name, last_name, phone, institution, role_id) VALUES
('docente@icfes.test', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqXg.u5L.a', 'María', 'García', '3007654321', 'Colegio Nacional', 2);

-- Progreso inicial para estudiante de prueba
INSERT INTO progress (user_id, subject_id, total_points, level, streak_days) VALUES
(1, 1, 150, 2, 5),
(1, 2, 75, 1, 3);

-- Notificación de bienvenida
INSERT INTO notifications (user_id, title, message, type) VALUES
(1, '¡Bienvenido a ICFES Prep!', 'Comienza tu preparación para el examen ICFES. ¡Mucho éxito!', 'info');

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista de estadísticas de estudiante
CREATE OR REPLACE VIEW student_stats AS
SELECT 
    u.id AS student_id,
    u.first_name,
    u.last_name,
    u.email,
    COUNT(DISTINCT e.id) AS total_exams,
    AVG(e.percentage) AS average_score,
    SUM(p.total_points) AS total_points,
    MAX(p.streak_days) AS max_streak
FROM users u
LEFT JOIN exams e ON u.id = e.student_id AND e.status = 'completed'
LEFT JOIN progress p ON u.id = p.user_id
WHERE u.role_id = (SELECT id FROM roles WHERE name = 'estudiante')
GROUP BY u.id, u.first_name, u.last_name, u.email;

-- Vista de exámenes pendientes de calificación
CREATE OR REPLACE VIEW pending_reviews AS
SELECT 
    e.id AS exam_id,
    e.title,
    e.created_at,
    e.score,
    e.percentage,
    u.first_name,
    u.last_name,
    u.email,
    s.name AS subject
FROM exams e
INNER JOIN users u ON e.student_id = u.id
LEFT JOIN subjects s ON e.subject_id = s.id
LEFT JOIN grades g ON e.id = g.exam_id
WHERE e.status = 'completed' AND g.id IS NULL
ORDER BY e.created_at DESC;

-- ============================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ============================================

CREATE INDEX idx_exam_student_status ON exams(student_id, status);
CREATE INDEX idx_progress_user_updated ON progress(user_id, updated_at);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- Procedimiento para actualizar racha de días
DELIMITER //
CREATE PROCEDURE update_streak(IN p_user_id INT, IN p_subject_id INT)
BEGIN
    DECLARE v_last_activity TIMESTAMP;
    DECLARE v_streak INT;
    
    SELECT last_activity, streak_days INTO v_last_activity, v_streak
    FROM progress
    WHERE user_id = p_user_id AND subject_id = p_subject_id;
    
    IF v_last_activity IS NOT NULL THEN
        IF DATEDIFF(NOW(), v_last_activity) = 1 THEN
            SET v_streak = v_streak + 1;
        ELSEIF DATEDIFF(NOW(), v_last_activity) > 1 THEN
            SET v_streak = 1;
        END IF;
        
        UPDATE progress 
        SET streak_days = v_streak, last_activity = NOW()
        WHERE user_id = p_user_id AND subject_id = p_subject_id;
    END IF;
END //
DELIMITER ;

COMMIT;
