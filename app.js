const express = require('express')
const app = express()
const port = 3000

// Servir archivos estáticos (CSS, imágenes, etc.)
app.use(express.static('public'))

// Ruta principal - página de inicio
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mi Primera App Node.js</title>
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
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 ¡Mi Primera App con Node.js!</h1>
            <p>Servidor funcionando correctamente</p>
            <div>
                <a href="/usuarios">Ver Usuarios</a>
                <a href="/api/datos">API JSON</a>
                <a href="/saludo/tu-nombre">Saludo Personalizado</a>
            </div>
        </div>
    </body>
    </html>
  `)
})

// Ruta para mostrar usuarios
app.get('/usuarios', (req, res) => {
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
        <title>Lista de Usuarios</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                max-width: 600px; 
                margin: 50px auto; 
                padding: 20px;
                background: #f5f5f5;
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
        <h1>📋 Lista de Usuarios</h1>
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

// API que devuelve JSON
app.get('/api/datos', (req, res) => {
  res.json({
    mensaje: "¡Hola desde la API!",
    servidor: "Node.js + Express",
    fecha: new Date().toLocaleString('es-ES'),
    datos: {
      usuarios_totales: 3,
      servidor_activo: true,
      version: "1.0.0"
    }
  })
})

// Ruta con parámetros
app.get('/saludo/:nombre', (req, res) => {
  const nombre = req.params.nombre
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Saludo Personalizado</title>
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
        </style>
    </head>
    <body>
        <h1>👋 ¡Hola, ${nombre}!</h1>
        <p>Bienvenido a mi aplicación Node.js</p>
        <p><a href="/">← Volver al inicio</a></p>
    </body>
    </html>
  `)
})

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor funcionando en http://localhost:${port}`)
  console.log(`📱 Abre tu navegador y visita las siguientes URLs:`)
  console.log(`   → http://localhost:${port}`)
  console.log(`   → http://localhost:${port}/usuarios`)
  console.log(`   → http://localhost:${port}/api/datos`)
  console.log(`   → http://localhost:${port}/saludo/TuNombre`)
})