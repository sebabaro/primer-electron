const { app, BrowserWindow } = require('electron')
const path = require('path')
const express = require('express')

// Tu servidor Express (importamos la lógica)
let server
let mainWindow

function createExpressServer() {
  const expressApp = express()
  const port = 3000

  // Reutilizamos todas las rutas de tu app.js
  expressApp.use(express.static('public'))

  expressApp.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Mi App Electron + Node.js</title>
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
                  margin: 10px;
                  padding: 10px 20px;
                  border: 2px solid #ffeb3b;
                  border-radius: 5px;
                  display: inline-block;
              }
              a:hover { background: #ffeb3b; color: #333; }
              .electron-badge {
                  background: #47848f;
                  padding: 5px 10px;
                  border-radius: 20px;
                  font-size: 0.8em;
                  margin-top: 10px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>🚀 Mi App Electron + Node.js</h1>
              <div class="electron-badge">
                  ⚡ Ejecutándose en Electron
              </div>
              <p>Servidor Node.js integrado funcionando correctamente</p>
              <div>
                  <a href="/usuarios">Ver Usuarios</a>
                  <a href="/api/datos">API JSON</a>
                  <a href="/saludo/Electron">Saludo Personalizado</a>
              </div>
          </div>
      </body>
      </html>
    `)
  })

  // Resto de tus rutas (copiadas de app.js)
  expressApp.get('/usuarios', (req, res) => {
    const usuarios = [
      { id: 1, nombre: 'Juan', edad: 25 },
      { id: 2, nombre: 'María', edad: 30 },
      { id: 3, nombre: 'Carlos', edad: 28 }
    ]
    
    let html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <title>Lista de Usuarios - Electron App</title>
          <style>
              body { 
                  font-family: Arial, sans-serif; 
                  max-width: 600px; 
                  margin: 50px auto; 
                  padding: 20px;
                  background: #f5f5f5;
              }
              .header { 
                  background: #47848f; 
                  color: white; 
                  padding: 10px; 
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
              a { color: #4CAF50; text-decoration: none; }
          </style>
      </head>
      <body>
          <div class="header">
              ⚡ Electron App - Lista de Usuarios
          </div>
          <table>
              <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Edad</th>
              </tr>
    `
    
    usuarios.forEach(user => {
      html += `
              <tr>
                  <td>${user.id}</td>
                  <td>${user.nombre}</td>
                  <td>${user.edad} años</td>
              </tr>
      `
    })
    
    html += `
          </table>
          <p><a href="/">← Volver al inicio</a></p>
      </body>
      </html>
    `
    
    res.send(html)
  })

  expressApp.get('/api/datos', (req, res) => {
    res.json({
      mensaje: "¡API funcionando en Electron!",
      servidor: "Node.js + Express + Electron",
      fecha: new Date().toLocaleString('es-ES'),
      datos: {
        usuarios_totales: 3,
        servidor_activo: true,
        version: "1.0.0",
        plataforma: "Electron Desktop App"
      }
    })
  })

  expressApp.get('/saludo/:nombre', (req, res) => {
    const nombre = req.params.nombre
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <title>Saludo - Electron App</title>
          <style>
              body { 
                  font-family: Arial, sans-serif; 
                  text-align: center; 
                  margin-top: 100px;
                  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                  color: white;
                  min-height: 100vh;
                  padding: 20px;
              }
              h1 { font-size: 3em; margin-bottom: 20px; }
              p { font-size: 1.2em; }
              a { color: white; }
              .electron-info {
                  background: rgba(0,0,0,0.3);
                  padding: 10px;
                  border-radius: 10px;
                  margin: 20px auto;
                  max-width: 300px;
              }
          </style>
      </head>
      <body>
          <h1>👋 ¡Hola, ${nombre}!</h1>
          <div class="electron-info">
              ⚡ Ejecutándose en Electron
          </div>
          <p>Bienvenido a mi aplicación de escritorio</p>
          <p><a href="/">← Volver al inicio</a></p>
      </body>
      </html>
    `)
  })

  return expressApp.listen(port, () => {
    console.log(`🚀 Servidor Express funcionando en puerto ${port}`)
  })
}

function createWindow() {
  // Crear la ventana del navegador
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, 'assets/icon.png'), // Opcional: icono de la app
    titleBarStyle: 'default',
    show: false // No mostrar hasta que esté listo
  })

  // Cargar la aplicación web
  mainWindow.loadURL('http://localhost:3000')

  // Mostrar ventana cuando esté lista
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Abrir DevTools en desarrollo (opcional)
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Este método se llamará cuando Electron haya terminado de inicializarse
app.whenReady().then(() => {
  // Primero iniciar el servidor Express
  server = createExpressServer()
  
  // Luego crear la ventana
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Salir cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (server) {
      server.close()
    }
    app.quit()
  }
})