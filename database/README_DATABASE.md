# Base de Datos ICFES - Instrucciones de Importación

## 📦 Archivo de Base de Datos

**Archivo principal**: `icfes_db_complete_backup.sql`

Este archivo contiene:
- ✅ Estructura completa de todas las tablas
- ✅ Datos existentes (usuarios, materias, preguntas, etc.)
- ✅ Relaciones y constraints (foreign keys)
- ✅ Índices optimizados
- ✅ Sistema de tutoría (tutor_id, messages, tasks)

## 🗄️ Estructura de la Base de Datos

### Tablas Principales:
1. **users** - Usuarios (estudiantes y docentes) con sistema de tutoría
2. **subjects** - Materias (Matemáticas, Lectura Crítica, etc.)
3. **questions** - Preguntas tipo ICFES
4. **exams** - Exámenes realizados por estudiantes
5. **exam_answers** - Respuestas de los exámenes
6. **grades** - Calificaciones
7. **progress** - Progreso de estudiantes por materia
8. **achievements** - Logros gamificados
9. **user_achievements** - Logros desbloqueados por usuarios

### Tablas del Sistema de Tutoría (Nuevas):
10. **messages** - Mensajes entre tutores y estudiantes
11. **tasks** - Tareas asignadas por tutores

## 📋 Requisitos Previos

- MySQL 8.0+ o MariaDB 10.4+
- XAMPP (recomendado para Windows)
- phpMyAdmin (opcional, incluido en XAMPP)

## 🚀 Métodos de Importación

### Método 1: Usando phpMyAdmin (Más Fácil)

1. Abre XAMPP Control Panel
2. Inicia Apache y MySQL
3. Abre phpMyAdmin: http://localhost/phpmyadmin
4. Haz clic en "Nuevo" para crear una base de datos
5. Nombre: `icfes_db`
6. Cotejamiento: `utf8mb4_unicode_ci`
7. Haz clic en "Crear"
8. Selecciona la base de datos `icfes_db`
9. Ve a la pestaña "Importar"
10. Haz clic en "Seleccionar archivo"
11. Selecciona `icfes_db_complete_backup.sql`
12. Haz clic en "Continuar"
13. ¡Listo! La base de datos está importada

### Método 2: Usando MySQL Command Line

#### En Windows (PowerShell):

```powershell
# Opción A: Con XAMPP
cd "C:\xampp\mysql\bin"
.\mysql.exe -u root -h localhost

# Dentro de MySQL:
CREATE DATABASE IF NOT EXISTS icfes_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE icfes_db;
SOURCE d:/Aplicativo-Mobil-/database/icfes_db_complete_backup.sql;
EXIT;
```

#### En Windows (Comando directo):

```powershell
# Con XAMPP
& "C:\xampp\mysql\bin\mysql.exe" -u root -h localhost icfes_db < "d:\Aplicativo-Mobil-\database\icfes_db_complete_backup.sql"
```

#### En Linux/Mac:

```bash
# Crear base de datos
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS icfes_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Importar
mysql -u root -p icfes_db < ./database/icfes_db_complete_backup.sql
```

### Método 3: Usando mysqldump (Para restaurar)

```powershell
# Windows con XAMPP
& "C:\xampp\mysql\bin\mysql.exe" -u root icfes_db < icfes_db_complete_backup.sql
```

## 🔐 Configuración de Conexión

Después de importar, asegúrate de que tu archivo `backend/config.py` tenga:

```python
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:@localhost:3306/icfes_db'
```

O crea/edita el archivo `.env` en el directorio `backend/`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=icfes_db
```

## ✅ Verificación

Para verificar que la importación fue exitosa:

```sql
-- Conectarse a MySQL
USE icfes_db;

-- Verificar tablas
SHOW TABLES;

-- Debería mostrar 11 tablas:
-- achievements, exam_answers, exams, grades, messages, 
-- progress, questions, subjects, tasks, user_achievements, users

-- Verificar cantidad de registros
SELECT 
    'users' as tabla, COUNT(*) as registros FROM users
UNION ALL
SELECT 'subjects', COUNT(*) FROM subjects
UNION ALL
SELECT 'questions', COUNT(*) FROM questions
UNION ALL
SELECT 'messages', COUNT(*) FROM messages
UNION ALL
SELECT 'tasks', COUNT(*) FROM tasks;
```

## 📊 Datos de Ejemplo

El archivo incluye:
- 👥 Usuarios de ejemplo (estudiantes y docentes)
- 📚 Materias del ICFES
- ❓ Preguntas tipo ICFES
- 🏆 Logros gamificados
- 📈 Sistema de progreso
- 💬 Sistema de mensajería
- ✅ Sistema de tareas

## 🔄 Hacer un Nuevo Backup

Si haces cambios y quieres crear un nuevo backup:

```powershell
# Windows con XAMPP
cd "d:\Aplicativo-Mobil-\database"
& "C:\xampp\mysql\bin\mysqldump.exe" -u root -h localhost icfes_db > icfes_db_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql
```

## 🆘 Solución de Problemas

### Error: "Access denied for user"
```sql
-- En MySQL, ejecuta:
GRANT ALL PRIVILEGES ON icfes_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Error: "Unknown database"
```sql
-- Primero crea la base de datos:
CREATE DATABASE icfes_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Error: "Table already exists"
```sql
-- Elimina la base de datos existente:
DROP DATABASE IF EXISTS icfes_db;
CREATE DATABASE icfes_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Luego importa de nuevo
```

## 📝 Notas Importantes

- ⚠️ El archivo de backup NO incluye contraseñas en texto plano (están hasheadas con bcrypt)
- 🔒 Las contraseñas por defecto de usuarios de prueba deben ser restablecidas
- 📦 El archivo incluye todas las migraciones aplicadas (tutor_id, messages, tasks)
- 🗄️ Compatible con MySQL 8.0+ y MariaDB 10.4+

## 🤝 Compartir la Base de Datos

Para compartir con otros desarrolladores:

1. Comprime el archivo:
   ```powershell
   Compress-Archive -Path "icfes_db_complete_backup.sql" -DestinationPath "icfes_db_backup.zip"
   ```

2. Comparte el archivo `.zip` junto con este README

3. El receptor debe seguir las instrucciones de "Métodos de Importación"

## 📧 Soporte

Si tienes problemas con la importación:
1. Verifica que MySQL/MariaDB esté corriendo
2. Verifica que tienes permisos suficientes
3. Revisa los logs de MySQL: `C:\xampp\mysql\data\mysql_error.log`
4. Asegúrate de usar el encoding `utf8mb4`

---

**Versión de Base de Datos**: Noviembre 2025  
**Compatible con**: Aplicación ICFES v1.0 con Sistema de Tutoría
