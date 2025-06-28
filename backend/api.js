const express = require('express')
const cors = require('cors')  // Para permitir requests desde el frontend
const { db, initDB } = require('./db')

const app = express()
const port = 3001  // Puerto diferente para API

// Middleware
app.use(cors())  // Permitir requests desde cualquier origen
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Inicializar base de datos
initDB()

// ====== SOLO APIS - NO HTML ======

// API: Obtener todos los usuarios
app.get('/api/usuarios', async (req, res) => {
  try {
    const usuarios = await db.getUsers()
    res.json({
      success: true,
      data: usuarios,
      total: usuarios.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// API: Crear usuario
app.post('/api/usuarios', async (req, res) => {
  try {
    const { nombre, email, edad } = req.body
    const nuevoUsuario = await db.createUser(nombre, email, parseInt(edad))
    res.status(201).json({
      success: true,
      data: nuevoUsuario,
      message: 'Usuario creado exitosamente'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// API: Obtener usuario por ID
app.get('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params
    const usuario = await db.getUserById(id)
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      })
    }
    
    res.json({
      success: true,
      data: usuario
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// API: Actualizar usuario
app.put('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, email, edad } = req.body
    const usuarioActualizado = await db.updateUser(id, nombre, email, parseInt(edad))
    
    if (!usuarioActualizado) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      })
    }
    
    res.json({
      success: true,
      data: usuarioActualizado,
      message: 'Usuario actualizado exitosamente'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// API: Eliminar usuario
app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params
    const usuarioEliminado = await db.deleteUser(id)
    
    if (!usuarioEliminado) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      })
    }
    
    res.json({
      success: true,
      data: usuarioEliminado,
      message: 'Usuario eliminado exitosamente'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// API: Obtener todos los productos
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await db.getProducts()
    res.json({
      success: true,
      data: productos,
      total: productos.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// API: Crear producto
app.post('/api/productos', async (req, res) => {
  try {
    const { nombre, precio, descripcion } = req.body
    const nuevoProducto = await db.createProduct(nombre, parseFloat(precio), descripcion)
    res.status(201).json({
      success: true,
      data: nuevoProducto,
      message: 'Producto creado exitosamente'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// API: Obtener estadísticas del dashboard
app.get('/api/dashboard', async (req, res) => {
  try {
    // Ejecutar consultas en paralelo
    const [usuarios, productos] = await Promise.all([
      db.getUsers(),
      db.getProducts()
    ])
    
    res.json({
      success: true,
      data: {
        totalUsuarios: usuarios.length,
        totalProductos: productos.length,
        usuariosRecientes: usuarios.slice(-5), // Últimos 5
        productosRecientes: productos.slice(-5),
        fechaConsulta: new Date().toISOString()
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Ruta de información de la API
app.get('/api', (req, res) => {
  res.json({
    name: 'Mi API REST',
    version: '1.0.0',
    endpoints: [
      'GET /api/usuarios',
      'POST /api/usuarios',
      'GET /api/usuarios/:id',
      'PUT /api/usuarios/:id',
      'DELETE /api/usuarios/:id',
      'GET /api/productos',
      'POST /api/productos',
      'GET /api/dashboard'
    ]
  })
})

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado'
  })
})

// Iniciar servidor API
app.listen(port, () => {
  console.log(`🚀 API REST funcionando en http://localhost:${port}/backend/api`)
  console.log(`🗃️ Conectado a PostgreSQL`)
  console.log(`📚 Documentación en http://localhost:${port}/backend/api`)
})