# 🚀 Guía Rápida para Ejecutar el Programa

## ✅ Prerrequisitos Necesarios

Antes de ejecutar el programa, asegúrate de tener instalado:

### 1. Python 3.11 o superior
```powershell
python --version
# Debe mostrar: Python 3.11.x o superior
```
Si no lo tienes: https://www.python.org/downloads/

### 2. Node.js 18 o superior
```powershell
node --version
npm --version
# Debe mostrar: v18.x.x o superior
```
Si no lo tienes: https://nodejs.org/ (descarga la versión LTS)

### 3. MySQL 8.0 o superior
```powershell
mysql --version
# Debe mostrar: mysql Ver 8.0.x
```
Si no lo tienes: https://dev.mysql.com/downloads/installer/

---

## 📦 Paso 1: Configurar la Base de Datos

### Opción A: Desde PowerShell
```powershell
# 1. Acceder a MySQL (te pedirá la contraseña de root)
mysql -u root -p

# 2. Dentro de MySQL, ejecuta:
CREATE DATABASE icfes_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# 3. Importar datos (desde la raíz del proyecto)
cd d:\Aplicativo-Mobil-
mysql -u root -p icfes_db < database\icfes_db.sql
```

### Opción B: Desde MySQL Workbench (GUI)
1. Abre MySQL Workbench
2. Conéctate a tu servidor local
3. Ejecuta: `CREATE DATABASE icfes_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
4. File → Run SQL Script → Selecciona `database/icfes_db.sql`

---

## ⚙️ Paso 2: Configurar el Backend

```powershell
# 1. Ir a la carpeta backend
cd d:\Aplicativo-Mobil-\backend

# 2. Editar el archivo .env
notepad .env

# 3. Configurar la contraseña de MySQL:
# Busca la línea: DB_PASSWORD=
# Cámbiala a: DB_PASSWORD=tu_contraseña_mysql
# Guarda y cierra

# 4. Activar entorno virtual
.\venv\Scripts\Activate.ps1

# NOTA: Si obtienes error de ejecución de scripts, ejecuta primero:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 5. Verificar que todo esté instalado
pip list
```

---

## 🎨 Paso 3: Configurar el Frontend

```powershell
# 1. Ir a la carpeta frontend
cd d:\Aplicativo-Mobil-\frontend

# 2. Instalar dependencias de Node.js
npm install

# Esto tomará unos minutos...
```

---

## 🏃 Paso 4: EJECUTAR EL PROGRAMA

### Necesitas 2 terminales abiertas:

### **Terminal 1 - Backend** (Puerto 5000)
```powershell
cd d:\Aplicativo-Mobil-\backend
.\venv\Scripts\Activate.ps1
python app.py
```

**Verás algo como:**
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```

### **Terminal 2 - Frontend** (Puerto 5173)
```powershell
cd d:\Aplicativo-Mobil-\frontend
npm run dev
```

**Verás algo como:**
```
  VITE v5.1.4  ready in 523 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🌐 Paso 5: Abrir en el Navegador

1. Abre tu navegador (Chrome, Edge, Firefox)
2. Ve a: **http://localhost:5173**
3. Deberías ver la página de login

---

## 👤 Usuarios de Prueba

### Estudiante:
- **Email:** estudiante@icfes.test
- **Contraseña:** Estudiante123

### Docente:
- **Email:** docente@icfes.test
- **Contraseña:** Docente123

---

## ❌ Solución de Problemas Comunes

### Error: "No se puede ejecutar scripts"
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: "MySQL connection refused"
- Verifica que MySQL esté corriendo
- Verifica la contraseña en `backend/.env`
- Verifica el puerto (predeterminado: 3306)

### Error: "npm: command not found"
- Cierra y abre PowerShell después de instalar Node.js
- O reinicia tu computadora

### Error: "python: command not found"
- Cierra y abre PowerShell después de instalar Python
- Verifica que Python esté en el PATH

### Puerto 5000 o 5173 en uso
```powershell
# Cambiar puerto del backend: edita backend/.env
PORT=5001

# Cambiar puerto del frontend: edita frontend/vite.config.js
server: {
  port: 3000
}
```

### Backend no conecta con MySQL
```powershell
# Edita backend/.env con tus datos correctos:
DB_HOST=localhost
DB_PORT=3306
DB_NAME=icfes_db
DB_USER=root
DB_PASSWORD=TU_CONTRASEÑA_AQUI
```

---

## 📊 Verificar que Todo Funciona

### 1. Backend Health Check
Abre en el navegador: http://localhost:5000/health

Debe mostrar:
```json
{
  "status": "ok",
  "database": "connected"
}
```

### 2. Frontend Cargando
Ve a: http://localhost:5173

Debe mostrar la página de login con el logo ICFES

### 3. Login Exitoso
- Ingresa con: estudiante@icfes.test / Estudiante123
- Debes ver el dashboard del estudiante con materias

---

## 🔄 Comandos Rápidos (Después de la Primera Vez)

### Iniciar Todo:
```powershell
# Terminal 1 (Backend)
cd d:\Aplicativo-Mobil-\backend; .\venv\Scripts\Activate.ps1; python app.py

# Terminal 2 (Frontend)
cd d:\Aplicativo-Mobil-\frontend; npm run dev
```

### Detener:
- Presiona `Ctrl + C` en cada terminal

---

## 🎯 Próximos Pasos

Una vez que el programa esté corriendo:

1. **Explora el Dashboard Estudiante** - Ver materias, estadísticas, progreso
2. **Explora el Dashboard Docente** - Ver estudiantes, calificar exámenes
3. **Prueba el Sistema de Login** - Registra un nuevo usuario
4. **Revisa las APIs** - http://localhost:5000 (backend)

---

## 📚 Documentación Adicional

- `README.md` - Documentación completa del proyecto
- `INSTALACION.md` - Guía detallada de instalación
- `PLAN_PROYECTO.md` - Arquitectura y plan del proyecto
- `ESTRUCTURA_PROYECTO.md` - Mapa del código fuente

---

**¡Listo! Tu aplicación ICFES está corriendo! 🎉**
