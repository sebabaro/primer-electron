const { app, BrowserWindow } = require('electron')
const path = require('path')
const express = require('express')
const { db, initDB } = require('./db')

// Variables globales
let server
let mainWindow

function createExpressServer() {
  const expressApp = express()
  const port = 3000

  // Middleware para parsear JSON
  expressApp.use(express.json())
  expressApp.use(express.urlencoded({ extended: true }))

  // Servir archivos estáticos
  expressApp.use(express.static('public'))

  // Inicializar base de datos al arrancar
  initDB()

  // Ruta principal
  expressApp.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Mi App Electron + PostgreSQL</title>
          <style>
              body { 
                  font-family: Arial, sans-serif; 
                  max-width: 800px; 
                  margin: 50px auto; 
                  padding: 20px;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
              }
              .container { 
                  background: rgba(255,255,255,0.1); 
                  padding: 30px; 
                  border-radius: 10px; 
                  text-align: center;
              }
              a { 
                  color: #ffeb3b; 
                  text-decoration: none; 
                  margin: 8px;
                  padding: 10px 20px;
                  border: 2px solid #ffeb3b;
                  border-radius: 5px;
                  display: inline-block;
                  font-size: 14px;
              }
              a:hover { background: #ffeb3b; color: #333; }
              .electron-badge {
                  background: #47848f;
                  padding: 5px 15px;
                  border-radius: 20px;
                  font-size: 0.9em;
                  margin: 10px 0;
                  display: inline-block;
              }
              .database-badge {
                  background: #4caf50;
                  padding: 5px 15px;
                  border-radius: 20px;
                  font-size: 0.9em;
                  margin: 10px 0;
                  display: inline-block;
              }
              .buttons-row {
                  margin: 10px 0;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>🚀 Electron + Node.js + PostgreSQL</h1>
              <div class="electron-badge">
                  ⚡ Ejecutándose en Electron
              </div>
              <div class="database-badge">
                  🗃️ Conectado a PostgreSQL
              </div>
              <p>Aplicación de escritorio con base de datos PostgreSQL</p>
              
              <div class="buttons-row">
                  <a href="/usuarios">👥 Ver Usuarios</a>
                  <a href="/productos">🛍️ Ver Productos</a>
              </div>
              
              <div class="buttons-row">
                  <a href="/formulario">➕ Agregar Usuario</a>
                  <a href="/formulario-productos">➕ Agregar Producto</a>
              </div>
              
              <div class="buttons-row">
                  <a href="/api/usuarios">📡 API Usuarios</a>
                  <a href="/api/productos">📡 API Productos</a>
              </div>
          </div>
      </body>
      </html>
    `)
  })

  // Ruta para mostrar usuarios desde la base de datos
  expressApp.get('/usuarios', async (req, res) => {
    try {
      const usuarios = await db.getUsers()
      
      let html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Usuarios - Electron + PostgreSQL</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    max-width: 800px; 
                    margin: 50px auto; 
                    padding: 20px;
                    background: #f5f5f5;
                }
                .header { 
                    background: #4caf50; 
                    color: white; 
                    padding: 15px; 
                    border-radius: 5px; 
                    margin-bottom: 20px;
                    text-align: center;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    background: white;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                th, td { 
                    padding: 12px; 
                    text-align: left; 
                    border-bottom: 1px solid #ddd; 
                }
                th { background: #4CAF50; color: white; }
                tr:hover { background: #f5f5f5; }
                a { color: #4CAF50; text-decoration: none; margin-right: 10px; }
                .empty-state {
                    text-align: center;
                    padding: 40px;
                    background: white;
                    border-radius: 5px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
            </style>
        </head>
        <body>
            <div class="header">
                ⚡ Electron + 🗃️ PostgreSQL - Usuarios
            </div>
      `
      
      if (usuarios.length === 0) {
        html += `
            <div class="empty-state">
                <h3>No hay usuarios registrados</h3>
                <p>Agrega el primer usuario desde el formulario</p>
                <a href="/formulario">Agregar Usuario</a>
            </div>
        `
      } else {
        html += `
            <table>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Edad</th>
                    <th>Fecha Registro</th>
                </tr>
        `
        
        usuarios.forEach(user => {
          const fecha = new Date(user.fecha_registro).toLocaleDateString('es-ES')
          html += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.nombre}</td>
                    <td>${user.email}</td>
                    <td>${user.edad} años</td>
                    <td>${fecha}</td>
                </tr>
          `
        })
        
        html += `</table>`
      }
      
      html += `
            <p>
                <a href="/">← Volver al inicio</a>
                <a href="/formulario">Agregar Usuario</a>
            </p>
        </body>
        </html>
      `
      
      res.send(html)
    } catch (error) {
      res.status(500).send(`Error: ${error.message}`)
    }
  })

  // Formulario para agregar usuarios
  expressApp.get('/formulario', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <title>Agregar Usuario - Electron</title>
          <style>
              body { 
                  font-family: Arial, sans-serif; 
                  max-width: 600px; 
                  margin: 50px auto; 
                  padding: 20px;
                  background: #f5f5f5;
              }
              .form-container { 
                  background: white; 
                  padding: 30px; 
                  border-radius: 10px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .form-group { margin-bottom: 20px; }
              label { display: block; margin-bottom: 5px; font-weight: bold; }
              input, select { 
                  width: 100%; 
                  padding: 10px; 
                  border: 1px solid #ddd; 
                  border-radius: 5px;
                  box-sizing: border-box;
              }
              button { 
                  background: #4CAF50; 
                  color: white; 
                  padding: 12px 30px; 
                  border: none; 
                  border-radius: 5px; 
                  cursor: pointer;
                  font-size: 16px;
              }
              button:hover { background: #45a049; }
              a { color: #4CAF50; text-decoration: none; }
              .electron-header {
                  background: #47848f;
                  color: white;
                  padding: 10px;
                  border-radius: 5px;
                  margin-bottom: 20px;
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <div class="form-container">
              <div class="electron-header">
                  ⚡ Electron App - Agregar Usuario
              </div>
              <form action="/usuarios" method="POST">
                  <div class="form-group">
                      <label for="nombre">Nombre:</label>
                      <input type="text" id="nombre" name="nombre" required>
                  </div>
                  <div class="form-group">
                      <label for="email">Email:</label>
                      <input type="email" id="email" name="email" required>
                  </div>
                  <div class="form-group">
                      <label for="edad">Edad:</label>
                      <input type="number" id="edad" name="edad" min="1" max="120" required>
                  </div>
                  <button type="submit">Agregar Usuario</button>
              </form>
              <p><a href="/usuarios">← Ver usuarios</a> | <a href="/">Inicio</a></p>
          </div>
      </body>
      </html>
    `)
  })

  // API para crear usuario (POST)
  expressApp.post('/usuarios', async (req, res) => {
    try {
      const { nombre, email, edad } = req.body
      const nuevoUsuario = await db.createUser(nombre, email, parseInt(edad))
      res.redirect('/usuarios')
    } catch (error) {
      res.status(500).send(`Error creando usuario: ${error.message}`)
    }
  })

  // Ruta para mostrar productos desde la base de datos
  expressApp.get('/productos', async (req, res) => {
    try {
      const productos = await db.getProducts()
      
      let html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Productos - Electron + PostgreSQL</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    max-width: 800px; 
                    margin: 50px auto; 
                    padding: 20px;
                    background: #f5f5f5;
                }
                .header { 
                    background: #ff9800; 
                    color: white; 
                    padding: 15px; 
                    border-radius: 5px; 
                    margin-bottom: 20px;
                    text-align: center;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    background: white;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                th, td { 
                    padding: 12px; 
                    text-align: left; 
                    border-bottom: 1px solid #ddd; 
                }
                th { background: #ff9800; color: white; }
                tr:hover { background: #f5f5f5; }
                a { color: #ff9800; text-decoration: none; margin-right: 10px; }
                .precio { font-weight: bold; color: #4CAF50; }
                .empty-state {
                    text-align: center;
                    padding: 40px;
                    background: white;
                    border-radius: 5px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
            </style>
        </head>
        <body>
            <div class="header">
                ⚡ Electron + 🛍️ Productos desde PostgreSQL
            </div>
      `
      
      if (productos.length === 0) {
        html += `
            <div class="empty-state">
                <h3>No hay productos registrados</h3>
                <p>Agrega el primer producto desde el formulario</p>
                <a href="/formulario-productos">Agregar Producto</a>
            </div>
        `
      } else {
        html += `
            <table>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Descripción</th>
                    <th>Fecha Creación</th>
                </tr>
        `
        
        productos.forEach(producto => {
          const fecha = new Date(producto.fecha_creacion).toLocaleDateString('es-ES')
          const precio = parseFloat(producto.precio).toLocaleString('es-ES', {
            style: 'currency',
            currency: 'ARS'
          })
          html += `
                <tr>
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td class="precio">${precio}</td>
                    <td>${producto.descripcion || 'Sin descripción'}</td>
                    <td>${fecha}</td>
                </tr>
          `
        })
        
        html += `</table>`
      }
      
      html += `
            <p>
                <a href="/">← Volver al inicio</a>
                <a href="/formulario-productos">Agregar Producto</a>
            </p>
        </body>
        </html>
      `
      
      res.send(html)
    } catch (error) {
      res.status(500).send(`Error: ${error.message}`)
    }
  })

  // Formulario para agregar productos
  expressApp.get('/formulario-productos', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <title>Agregar Producto - Electron</title>
          <style>
              body { 
                  font-family: Arial, sans-serif; 
                  max-width: 600px; 
                  margin: 50px auto; 
                  padding: 20px;
                  background: #f5f5f5;
              }
              .form-container { 
                  background: white; 
                  padding: 30px; 
                  border-radius: 10px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .form-group { margin-bottom: 20px; }
              label { display: block; margin-bottom: 5px; font-weight: bold; }
              input, textarea, select { 
                  width: 100%; 
                  padding: 10px; 
                  border: 1px solid #ddd; 
                  border-radius: 5px;
                  box-sizing: border-box;
              }
              textarea { height: 80px; resize: vertical; }
              button { 
                  background: #ff9800; 
                  color: white; 
                  padding: 12px 30px; 
                  border: none; 
                  border-radius: 5px; 
                  cursor: pointer;
                  font-size: 16px;
              }
              button:hover { background: #f57c00; }
              a { color: #ff9800; text-decoration: none; }
              .electron-header {
                  background: #47848f;
                  color: white;
                  padding: 10px;
                  border-radius: 5px;
                  margin-bottom: 20px;
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <div class="form-container">
              <div class="electron-header">
                  ⚡ Electron App - Agregar Producto
              </div>
              <form action="/productos" method="POST">
                  <div class="form-group">
                      <label for="nombre">Nombre del Producto:</label>
                      <input type="text" id="nombre" name="nombre" required>
                  </div>
                  <div class="form-group">
                      <label for="precio">Precio (ARS):</label>
                      <input type="number" id="precio" name="precio" step="0.01" min="0" required>
                  </div>
                  <div class="form-group">
                      <label for="descripcion">Descripción:</label>
                      <textarea id="descripcion" name="descripcion" placeholder="Descripción del producto (opcional)"></textarea>
                  </div>
                  <button type="submit">Agregar Producto</button>
              </form>
              <p><a href="/productos">← Ver productos</a> | <a href="/">Inicio</a></p>
          </div>
      </body>
      </html>
    `)
  })

  // API para crear producto (POST)
  expressApp.post('/productos', async (req, res) => {
    try {
      const { nombre, precio, descripcion } = req.body
      const nuevoProducto = await db.createProduct(nombre, parseFloat(precio), descripcion)
      res.redirect('/productos')
    } catch (error) {
      res.status(500).send(`Error creando producto: ${error.message}`)
    }
  })

  // APIs JSON
  expressApp.get('/api/usuarios', async (req, res) => {
    try {
      const usuarios = await db.getUsers()
      res.json({
        total: usuarios.length,
        usuarios: usuarios,
        servidor: "Electron + Node.js + Express + PostgreSQL",
        fecha: new Date().toLocaleString('es-ES')
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  expressApp.get('/api/productos', async (req, res) => {
    try {
      const productos = await db.getProducts()
      res.json({
        total: productos.length,
        productos: productos,
        servidor: "Electron + Node.js + Express + PostgreSQL",
        fecha: new Date().toLocaleString('es-ES')
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  return expressApp.listen(port, () => {
    console.log(`🚀 Servidor Express funcionando en puerto ${port}`)
    console.log(`🗃️ Conectado a PostgreSQL`)
  })
}

function createWindow() {
  // Crear la ventana principal
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    show: false, // No mostrar hasta que esté listo
    center: true,
    titleBarStyle: 'default'
  })

  // Cargar la aplicación web local
  mainWindow.loadURL('http://localhost:3000')

  // Mostrar ventana cuando esté lista
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    console.log('✅ Aplicación Electron lista!')
  })

  // Opcional: Abrir DevTools para desarrollo
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Inicializar Electron
app.whenReady().then(() => {
  console.log('🔄 Iniciando servidor Express...')
  
  // Primero iniciar el servidor Express
  server = createExpressServer()
  
  // Esperar un momento y luego crear la ventana
  setTimeout(() => {
    console.log('🖥️  Creando ventana de Electron...')
    createWindow()
  }, 1000)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Cerrar cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (server) {
      server.close()
      console.log('🔴 Servidor Express cerrado')
    }
    app.quit()
  }
})

// Manejar errores
process.on('uncaughtException', (error) => {
  console.error('Error no manejado:', error)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason)
})