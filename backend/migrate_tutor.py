"""
Script de migración: Agregar campo tutor_id a la tabla users
"""
import pymysql
from config import Config

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
                
                # Verificar si la columna ya existe
                cursor.execute("""
                    SELECT COUNT(*) as count
                    FROM INFORMATION_SCHEMA.COLUMNS
                    WHERE TABLE_SCHEMA = 'icfes_db'
                    AND TABLE_NAME = 'users'
                    AND COLUMN_NAME = 'tutor_id'
                """)
                result = cursor.fetchone()
                
                if result['count'] > 0:
                    print("⚠️  La columna 'tutor_id' ya existe en la tabla 'users'")
                    return
                
                # Agregar columna tutor_id
                print("Agregando columna 'tutor_id'...")
                cursor.execute("""
                    ALTER TABLE users 
                    ADD COLUMN tutor_id INT NULL
                """)
                
                # Agregar foreign key
                print("Agregando restricción de foreign key...")
                cursor.execute("""
                    ALTER TABLE users
                    ADD CONSTRAINT fk_users_tutor 
                    FOREIGN KEY (tutor_id) 
                    REFERENCES users(id) 
                    ON DELETE SET NULL
                """)
                
                # Crear índice
                print("Creando índice...")
                cursor.execute("""
                    CREATE INDEX idx_users_tutor_id ON users(tutor_id)
                """)
                
                connection.commit()
                print("✅ Migración completada exitosamente!")
                
                # Verificar estructura
                cursor.execute("DESCRIBE users")
                columns = cursor.fetchall()
                print("\n📋 Estructura actualizada de la tabla 'users':")
                for col in columns:
                    print(f"  - {col['Field']}: {col['Type']}")
                
    except pymysql.Error as e:
        print(f"❌ Error en la migración: {e}")
        return False
    
    return True

if __name__ == '__main__':
    print("🚀 Iniciando migración: Sistema de Tutoría")
    print("=" * 50)
    run_migration()
    print("=" * 50)
