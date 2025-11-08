-- Migración: Agregar campo tutor_id a la tabla users
-- Fecha: 2025-11-08
-- Descripción: Agrega soporte para el sistema de tutoría docente-estudiante

USE icfes_db;

-- Agregar columna tutor_id si no existe
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS tutor_id INT NULL,
ADD CONSTRAINT fk_users_tutor 
    FOREIGN KEY (tutor_id) 
    REFERENCES users(id) 
    ON DELETE SET NULL;

-- Crear índice para mejorar consultas
CREATE INDEX IF NOT EXISTS idx_users_tutor_id ON users(tutor_id);

-- Verificar la estructura
DESCRIBE users;

-- Mostrar mensaje de confirmación
SELECT 'Migración completada: campo tutor_id agregado exitosamente' AS resultado;
