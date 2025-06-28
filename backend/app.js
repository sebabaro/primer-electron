const express = require('express')
const { db, initDB } = require('./db')

const app = express()
const port = 3000

// Middleware para parsear JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Servir archivos estáticos
app.use(express.static('public'))

// Inicializar base de datos al arrancar
initDB()

// Ruta principal
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mi App con PostgreSQL</title>
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
            .database-badge {
                background: #4caf50;
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 0.9em;
                margin: 10px 0;
                display: inline-block;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Mi App con PostgreSQL</h1>
            <div class="database-badge">
                🗃️ Conectado a PostgreSQL
            </div>
            <p>Aplicación Node.js con base de datos PostgreSQL</p>
            <div>
                <a href="/usuarios">Ver Usuarios (DB)</a>
                <a href="/productos">Ver Productos (DB)</a>
                <a href="/formulario">Agregar Usuario</a>
                <a href="/formulario-productos">Agregar Producto</a>
            </div>
            <div style="margin-top: 15px;">
                <a href="/api/usuarios">API Usuarios</a>
                <a href="/api/productos">API Productos</a>
            </div>
        </div>
    </body>
    </html>
  `)
})

// Ruta para mostrar usuarios desde la base de datos
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await db.getUsers()
    
    let html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <title>Usuarios desde PostgreSQL</title>
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
              🗃️ Usuarios desde PostgreSQL
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
app.get('/formulario', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Agregar Usuario</title>
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
        </style>
    </head>
    <body>
        <div class="form-container">
            <h2>🗃️ Agregar Nuevo Usuario</h2>
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
app.post('/usuarios', async (req, res) => {
  try {
    const { nombre, email, edad } = req.body
    const nuevoUsuario = await db.createUser(nombre, email, parseInt(edad))
    
    // Redirigir a la lista de usuarios después de crear
    res.redirect('/usuarios')
  } catch (error) {
    res.status(500).send(`Error creando usuario: ${error.message}`)
  }
})

// API que devuelve usuarios en JSON
app.get('/api/usuarios', async (req, res) => {
  try {
    const usuarios = await db.getUsers()
    res.json({
      total: usuarios.length,
      usuarios: usuarios,
      servidor: "Node.js + Express + PostgreSQL",
      fecha: new Date().toLocaleString('es-ES')
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Ruta para mostrar productos desde la base de datos
app.get('/productos', async (req, res) => {
  try {
    const productos = await db.getProducts()
    
    let html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <title>Productos desde PostgreSQL</title>
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
              🛍️ Productos desde PostgreSQL
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
app.get('/formulario-productos', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Agregar Producto</title>
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
        </style>
    </head>
    <body>
        <div class="form-container">
            <h2>🛍️ Agregar Nuevo Producto</h2>
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
app.post('/productos', async (req, res) => {
  try {
    const { nombre, precio, descripcion } = req.body
    const nuevoProducto = await db.createProduct(nombre, parseFloat(precio), descripcion)
    
    // Redirigir a la lista de productos después de crear
    res.redirect('/productos')
  } catch (error) {
    res.status(500).send(`Error creando producto: ${error.message}`)
  }
})

// API que devuelve productos en JSON
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await db.getProducts()
    res.json({
      total: productos.length,
      productos: productos,
      servidor: "Node.js + Express + PostgreSQL",
      fecha: new Date().toLocaleString('es-ES')
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Ruta con parámetros (mantener la original)
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
            .db-info {
                background: rgba(0,0,0,0.3);
                padding: 15px;
                border-radius: 10px;
                margin: 20px auto;
                max-width: 300px;
            }
        </style>
    </head>
    <body>
        <h1>👋 ¡Hola, ${nombre}!</h1>
        <div class="db-info">
            🗃️ Aplicación con PostgreSQL
        </div>
        <p>Bienvenido a mi aplicación con base de datos</p>
        <p><a href="/">← Volver al inicio</a></p>
    </body>
    </html>
  `)
})

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor funcionando en http://localhost:${port}`)
  console.log(`🗃️ Conectado a PostgreSQL`)
  console.log(`📱 Rutas disponibles:`)
  console.log(`   → http://localhost:${port}`)
  console.log(`   → http://localhost:${port}/usuarios`)
  console.log(`   → http://localhost:${port}/formulario`)
  console.log(`   → http://localhost:${port}/api/usuarios`)
})