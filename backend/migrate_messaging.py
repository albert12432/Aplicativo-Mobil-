"""
Script de migración: Crear tablas de mensajes y tareas
"""
import pymysql

def run_migration():
    """Ejecutar migración de base de datos"""
    try:
        # Conectar a la base de datos
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='',
            database='icfes_db',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        with connection:
            with connection.cursor() as cursor:
                print("Conectado a la base de datos...")
                
                # Verificar si las tablas ya existen
                cursor.execute("SHOW TABLES LIKE 'messages'")
                messages_exists = cursor.fetchone()
                
                cursor.execute("SHOW TABLES LIKE 'tasks'")
                tasks_exists = cursor.fetchone()
                
                if messages_exists and tasks_exists:
                    print("⚠️  Las tablas 'messages' y 'tasks' ya existen")
                    return
                
                print("\n📦 Creando tabla 'messages'...")
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS messages (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        sender_id INT NOT NULL,
                        receiver_id INT NOT NULL,
                        subject VARCHAR(200),
                        message TEXT NOT NULL,
                        is_read BOOLEAN DEFAULT FALSE,
                        read_at TIMESTAMP NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        
                        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
                        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
                        
                        INDEX idx_messages_sender (sender_id),
                        INDEX idx_messages_receiver (receiver_id),
                        INDEX idx_messages_created (created_at)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                """)
                print("✅ Tabla 'messages' creada")
                
                print("\n📦 Creando tabla 'tasks'...")
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS tasks (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        tutor_id INT NOT NULL,
                        student_id INT NOT NULL,
                        subject_id INT NULL,
                        title VARCHAR(200) NOT NULL,
                        description TEXT,
                        due_date TIMESTAMP NULL,
                        priority VARCHAR(20) DEFAULT 'medium',
                        status VARCHAR(20) DEFAULT 'pending',
                        completion_note TEXT,
                        completed_at TIMESTAMP NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        
                        FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE,
                        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
                        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
                        
                        INDEX idx_tasks_tutor (tutor_id),
                        INDEX idx_tasks_student (student_id),
                        INDEX idx_tasks_status (status),
                        INDEX idx_tasks_due_date (due_date)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                """)
                print("✅ Tabla 'tasks' creada")
                
                connection.commit()
                print("\n✅ Migración completada exitosamente!")
                
                # Verificar estructura
                print("\n📋 Estructura de la tabla 'messages':")
                cursor.execute("DESCRIBE messages")
                for col in cursor.fetchall():
                    print(f"  - {col['Field']}: {col['Type']}")
                
                print("\n📋 Estructura de la tabla 'tasks':")
                cursor.execute("DESCRIBE tasks")
                for col in cursor.fetchall():
                    print(f"  - {col['Field']}: {col['Type']}")
                
    except pymysql.Error as e:
        print(f"❌ Error en la migración: {e}")
        return False
    
    return True

if __name__ == '__main__':
    print("🚀 Iniciando migración: Sistema de Mensajería y Tareas")
    print("=" * 60)
    run_migration()
    print("=" * 60)
