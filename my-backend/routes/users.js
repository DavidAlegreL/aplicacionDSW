var express = require('express');
var router = express.Router();
const db = require('../database');

// Crear un nuevo usuario
router.post('/', (req, res) => {
  const { name, password } = req.body;
  console.log('Datos recibidos:', req.body); // Agrega esta línea para verificar los datos recibidos
  if (!name || !password) {
    return res.status(400).json('Nombre y contraseña son requeridos');
  }
  db.run('INSERT INTO User(name, password) VALUES(?, ?)', [name, password], function(err) {
    if (err) {
      console.error('Error insertando usuario', err.message);
      return res.status(500).json('Error insertando usuario');
    }
    console.log(`Usuario creado con id: ${this.lastID}`);
    res.send('Usuario creado');
  });
});

// Obtener todos los usuarios
router.get('/', (req, res) => {
  db.all('SELECT * FROM User', (err, rows) => {
    if (err) {
      console.error('Error obteniendo usuarios', err.message);
      res.status(500).json('Error obteniendo usuarios');
    }
    res.json(rows);
  });
});

// Borrar usuario por su ID
router.post('/delete', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).send('ID de usuario requerido');
  }
  db.run('DELETE FROM User WHERE id=?', [userId], function(err) {
    if (err) {
      console.error('Error borrando usuario', err.message);
      return res.status(500).send('Error borrando usuario');
    }
    console.log(`Usuario borrado con id: ${userId}`);
    res.send('Usuario borrado');
  });
});

module.exports = router;