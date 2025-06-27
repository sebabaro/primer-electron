# Primer Electron - Aplicación Web + Escritorio

Una aplicación completa que funciona tanto como aplicación web tradicional como aplicación de escritorio con Electron, conectada a PostgreSQL.

## 🚀 Características

- ⚡ **Aplicación de escritorio** con Electron
- 🌐 **Aplicación web** tradicional
- 🗃️ **Base de datos PostgreSQL** con CRUD completo
- 👥 **Gestión de usuarios** (crear, ver, listar)
- 🛍️ **Gestión de productos** (crear, ver, listar)
- 📡 **APIs REST** en formato JSON
- 🎨 **Interfaz responsive** con CSS moderno

## 📋 Tecnologías utilizadas

- **Backend**: Node.js + Express.js
- **Base de datos**: PostgreSQL + driver pg
- **Desktop**: Electron
- **Frontend**: HTML, CSS, JavaScript vanilla
- **Build**: electron-builder para generar ejecutables

## 🛠️ Instalación

1. **Clonar el repositorio:**

```bash
git clone https://github.com/sebabaro/primer-electron.git
cd primer-electron
```

2. **Instalar dependencias:**

```bash
npm install
```

3. **Configurar PostgreSQL:**
   - Instalar PostgreSQL en tu sistema
   - Crear base de datos: `CREATE DATABASE mi_app_db;`
   - Configurar credenciales en `db.js`

## 🎯 Modos de ejecución

### Aplicación Web (desarrollo)

```bash
npm start
```

Abre tu navegador en: http://localhost:3000

### Aplicación de Escritorio

```bash
npm run electron
```

Se abre como aplicación nativa de Windows

### Desarrollo con auto-reload

```bash
npm run dev
```

### Generar ejecutable (.exe)

```bash
npm run build-win
```

## 📁 Estructura del proyecto

```
primer-electron/
├── app.js              # Servidor web principal
├── main.js             # Aplicación Electron
├── db.js               # Configuración PostgreSQL
├── package.json        # Dependencias y scripts
├── .gitignore         # Archivos ignorados por Git
└── dist/              # Ejecutables generados (después de build)
```

## 🔧 Configuración de base de datos

Edita el archivo `db.js` con tus credenciales:

```javascript
const pool = new Pool({
  user: 'postgres', // Tu usuario
  host: 'localhost',
  database: 'mi_app_db', // Tu base de datos
  password: 'tu_password', // Tu contraseña
  port: 5432,
})
```

## 📱 Rutas disponibles

### Interfaz Web

- `/` - Página principal
- `/usuarios` - Lista de usuarios
- `/productos` - Lista de productos
- `/formulario` - Agregar usuario
- `/formulario-productos` - Agregar producto

### APIs JSON

- `/api/usuarios` - GET usuarios en JSON
- `/api/productos` - GET productos en JSON

## 🎨 Capturas de pantalla

### Aplicación Web

- Interfaz responsive con gradientes CSS
- Formularios funcionales
- Tablas con hover effects

### Aplicación Electron

- Ventana nativa de Windows
- Misma funcionalidad que la web
- Badges indicando "Ejecutándose en Electron"

## 🚀 Distribución

Para crear un ejecutable distribuible:

1. **Generar .exe:**

```bash
npm run build-win
```

2. **El archivo se genera en:** `dist/`

3. **Enviar a usuarios:** Solo necesitan el instalador .exe

## 📄 Licencia

ISC

## 👨‍💻 Autor

Sebastian Baro - [GitHub](https://github.com/sebabaro)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
