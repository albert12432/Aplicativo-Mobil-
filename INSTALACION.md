# 🚀 Guía de Instalación Rápida - Sistema ICFES Prep

## ⚡ Instalación Express (10 minutos)

### Paso 1: Verificar Requisitos
```powershell
# Verificar Python
python --version
# Debe mostrar: Python 3.11 o superior

# Verificar Node.js
node --version
# Debe mostrar: v18.0.0 o superior

# Verificar MySQL
mysql --version
```

### Paso 2: Crear Base de Datos
```powershell
# Abrir MySQL
mysql -u root -p

# Dentro de MySQL, ejecutar:
CREATE DATABASE icfes_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# Importar estructura
mysql -u root -p icfes_db < database\icfes_db.sql
```

### Paso 3: Configurar Backend
```powershell
# Navegar a backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Si hay error de permisos, ejecutar:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Instalar dependencias
pip install -r requirements.txt

# Copiar y configurar .env
copy .env.example .env

# Editar .env con tus credenciales de MySQL
# Usar notepad o tu editor favorito:
notepad .env
```

**Contenido del .env:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=icfes_db
DB_USER=root
DB_PASSWORD=TU_PASSWORD_MYSQL_AQUI
SECRET_KEY=mi_clave_super_secreta_12345
JWT_SECRET_KEY=jwt_clave_secreta_67890
DEBUG=True
```

### Paso 4: Iniciar Backend
```powershell
# En el directorio backend con el entorno activado
python app.py

# Debe mostrar:
# * Running on http://127.0.0.1:5000
```

### Paso 5: Configurar Frontend (Nueva Terminal)
```powershell
# Abrir nueva terminal PowerShell
# Navegar a frontend
cd frontend

# Instalar dependencias
npm install

# Copiar .env
copy .env.example .env

# El .env ya está configurado correctamente
```

### Paso 6: Iniciar Frontend
```powershell
# En el directorio frontend
npm run dev

# Debe mostrar:
# VITE ready in X ms
# ➜  Local:   http://localhost:5173/
```

### Paso 7: ¡Listo! 🎉

Abre tu navegador en: **http://localhost:5173**

**Usuarios de prueba:**
- **Estudiante:** estudiante@icfes.test / Estudiante123
- **Docente:** docente@icfes.test / Docente123

---

## 🔧 Solución de Problemas Comunes

### Error: "pip no se reconoce"
```powershell
# Reinstalar Python y marcar "Add to PATH" durante instalación
# O agregar Python al PATH manualmente
```

### Error: "cannot be loaded because running scripts is disabled"
```powershell
# Ejecutar PowerShell como Administrador:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: "Access denied for user 'root'@'localhost'"
```powershell
# Verificar contraseña de MySQL en .env
# O crear nuevo usuario:
mysql -u root -p
CREATE USER 'icfes_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON icfes_db.* TO 'icfes_user'@'localhost';
FLUSH PRIVILEGES;
```

### Error: "Port 5000 already in use"
```powershell
# Cambiar puerto en backend/.env:
PORT=5001

# Y actualizar frontend/.env:
VITE_API_URL=http://localhost:5001/api
```

### Error: "Module not found" en Frontend
```powershell
# Limpiar cache y reinstalar:
cd frontend
rm -r node_modules
rm package-lock.json
npm install
```

---

## 📝 Comandos Útiles

### Backend
```powershell
# Activar entorno
cd backend
.\venv\Scripts\Activate.ps1

# Instalar nueva dependencia
pip install nombre_paquete
pip freeze > requirements.txt

# Ver logs detallados
set FLASK_ENV=development
python app.py

# Desactivar entorno
deactivate
```

### Frontend
```powershell
cd frontend

# Desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview

# Limpiar cache
npm cache clean --force
```

### Base de Datos
```powershell
# Backup
mysqldump -u root -p icfes_db > backup.sql

# Restaurar
mysql -u root -p icfes_db < backup.sql

# Verificar tablas
mysql -u root -p icfes_db -e "SHOW TABLES;"
```

---

## 🎯 Verificación Post-Instalación

### 1. Backend Funcionando ✅
Abrir: http://localhost:5000
```json
{
  "message": "Sistema de Preparación ICFES - API",
  "version": "1.0.0"
}
```

### 2. Frontend Funcionando ✅
Abrir: http://localhost:5173
Debe cargar la página de login

### 3. Base de Datos ✅
```powershell
mysql -u root -p icfes_db -e "SELECT COUNT(*) FROM users;"
# Debe mostrar: 2 (usuarios de prueba)
```

### 4. Login Funcional ✅
1. Ir a http://localhost:5173/login
2. Ingresar: estudiante@icfes.test / Estudiante123
3. Debe redirigir al dashboard

---

## 🚀 Siguiente Paso

Una vez verificado que todo funciona:
1. Explorar el dashboard de estudiante
2. Crear un examen de prueba
3. Revisar las estadísticas
4. Probar con el usuario docente

**¡Felicitaciones! El sistema está listo para usar.** 🎉
