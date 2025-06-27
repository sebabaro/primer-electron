const { Pool } = require('pg')

// Configuración de la base de datos
const pool = new Pool({
  user: 'postgres',           // Usuario de PostgreSQL
  host: 'localhost',          // Servidor (localhost para local)
  database: 'ejemplo',      // Nombre de tu base de datos
  password: '1qaz2wsx',    // Contraseña que configuraste
  port: 5432,                 // Puerto por defecto de PostgreSQL
})

// Función para probar la conexión
async function testConnection() {
  try {
    const client = await pool.connect()
    console.log('✅ Conectado a PostgreSQL exitosamente')
    const result = await client.query('SELECT NOW()')
    console.log('🕐 Hora del servidor:', result.rows[0].now)
    client.release()
  } catch (err) {
    console.error('❌ Error conectando a PostgreSQL:', err.message)
  }
}

// Función para crear tablas si no existen
async function createTables() {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      edad INTEGER,
      fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS productos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      precio DECIMAL(10,2) NOT NULL,
      descripcion TEXT,
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  try {
    await pool.query(createUsersTable)
    await pool.query(createProductsTable)
    console.log('✅ Tablas creadas o verificadas exitosamente')
  } catch (err) {
    console.error('❌ Error creando tablas:', err.message)
  }
}

// Funciones para interactuar con la base de datos
const db = {
  // Obtener todos los usuarios
  async getUsers() {
    try {
      const result = await pool.query('SELECT * FROM usuarios ORDER BY id')
      return result.rows
    } catch (err) {
      console.error('Error obteniendo usuarios:', err)
      throw err
    }
  },

  // Crear un nuevo usuario
  async createUser(nombre, email, edad) {
    try {
      const query = 'INSERT INTO usuarios (nombre, email, edad) VALUES ($1, $2, $3) RETURNING *'
      const result = await pool.query(query, [nombre, email, edad])
      return result.rows[0]
    } catch (err) {
      console.error('Error creando usuario:', err)
      throw err
    }
  },

  // Obtener usuario por ID
  async getUserById(id) {
    try {
      const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id])
      return result.rows[0]
    } catch (err) {
      console.error('Error obteniendo usuario:', err)
      throw err
    }
  },

  // Actualizar usuario
  async updateUser(id, nombre, email, edad) {
    try {
      const query = 'UPDATE usuarios SET nombre = $1, email = $2, edad = $3 WHERE id = $4 RETURNING *'
      const result = await pool.query(query, [nombre, email, edad, id])
      return result.rows[0]
    } catch (err) {
      console.error('Error actualizando usuario:', err)
      throw err
    }
  },

  // Eliminar usuario
  async deleteUser(id) {
    try {
      const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id])
      return result.rows[0]
    } catch (err) {
      console.error('Error eliminando usuario:', err)
      throw err
    }
  },

  // Obtener todos los productos
  async getProducts() {
    try {
      const result = await pool.query('SELECT * FROM productos ORDER BY id')
      return result.rows
    } catch (err) {
      console.error('Error obteniendo productos:', err)
      throw err
    }
  },

  // Crear un nuevo producto
  async createProduct(nombre, precio, descripcion) {
    try {
      const query = 'INSERT INTO productos (nombre, precio, descripcion) VALUES ($1, $2, $3) RETURNING *'
      const result = await pool.query(query, [nombre, precio, descripcion])
      return result.rows[0]
    } catch (err) {
      console.error('Error creando producto:', err)
      throw err
    }
  }
}

// Inicializar la base de datos
async function initDB() {
  await testConnection()
  await createTables()
}

module.exports = { db, initDB, pool }