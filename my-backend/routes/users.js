var express = require('express');
var router = express.Router();
const db = require('../database');

// Crear un nuevo usuario
router.post('/', (req, res) => {
  const { name, pwd1, pwd2 } = req.body;
  console.log('Datos recibidos:', req.body); // Agrega esta línea para verificar los datos recibidos
  if (!name || !pwd1 || !pwd2) {
    return res.status(400).json({ error: 'Nombre y contraseñas son requeridos' });
  }
  if (pwd1 !== pwd2) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden' });
  }
  db.run('INSERT INTO User(name, password) VALUES(?, ?)', [name, pwd1], function(err) {
    if (err) {
      console.error('Error insertando usuario', err.message);
      return res.status(500).json({ error: 'Error insertando usuario' });
    }
    console.log(`Usuario creado con id: ${this.lastID}`);
    res.status(201).json({ message: 'Usuario creado', userId: this.lastID });
  });
});

// Obtener todos los usuarios
router.get('/', (req, res) => {
  db.all('SELECT * FROM User', (err, rows) => {
    if (err) {
      console.error('Error obteniendo usuarios', err.message);
      res.status(500).json({ error: 'Error obteniendo usuarios' });
    }
    res.json(rows);
  });
});

// Borrar usuario por su ID
router.post('/delete', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).send({ error: 'ID de usuario requerido' });
  }
  db.run('DELETE FROM User WHERE id=?', [userId], function(err) {
    if (err) {
      console.error('Error borrando usuario', err.message);
      return res.status(500).send({ error: 'Error borrando usuario' });
    }
    console.log(`Usuario borrado con id: ${userId}`);
    res.status(200).send({ message: 'Usuario borrado' });
  });
});

// Login de usuario
router.post('/login', (req, res) => {
  const { name, password } = req.body;
  console.log('Datos recibidos para login:', req.body);
  if (!name || !password) {
    return res.status(400).json({ error: 'Nombre y contraseña son requeridos' });
  }
  db.get('SELECT id FROM User WHERE name = ? AND password = ?', [name, password], (err, row) => {
    if (err) {
      console.error('Error autenticando usuario', err.message);
      return res.status(500).json({ error: 'Error autenticando usuario' });
    }
    if (!row) {
      return res.status(401).json({ error: 'Nombre o contraseña incorrectos' });
    }
    res.status(200).json({ userId: row.id });
  });
});

// Obtener el perfil del usuario por su ID
router.get('/profile/:userId', (req, res) => {
  const { userId } = req.params;
  db.get('SELECT * FROM User WHERE id = ?', [userId], (err, row) => {
    if (err) {
      console.error('Error obteniendo perfil del usuario', err.message);
      return res.status(500).json({ error: 'Error obteniendo perfil del usuario' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(row);
  });
});

// Actualizar el perfil del usuario por su ID
router.put('/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const { realName, email, phone, address } = req.body;

  // Validar los datos recibidos
  if (!realName || !email || !phone || !address) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  db.run(
    'UPDATE User SET realName = ?, email = ?, phone = ?, address = ? WHERE id = ?',
    [realName, email, phone, address, userId],
    function (err) {
      if (err) {
        console.error('Error actualizando perfil del usuario', err.message);
        return res.status(500).json({ error: 'Error actualizando perfil del usuario' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.status(200).json({ message: 'Perfil actualizado' });
    }
  );
});
router.post('/top-up', (req, res) => {
  const { userId, amount } = req.body;

  // Validar los datos recibidos
  if (!userId || amount == null || amount <= 0) {
    return res.status(400).json({ error: 'ID de usuario y una cantidad válida son requeridos' });
  }

  // Actualizar el saldo del usuario
  db.run(
    'UPDATE User SET balance = balance + ? WHERE id = ?',
    [amount, userId],
    function (err) {
      if (err) {
        console.error('Error añadiendo saldo al usuario', err.message);
        return res.status(500).json({ error: 'Error añadiendo saldo al usuario' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.status(200).json({ message: 'Saldo añadido con éxito' });
    }
  );
});

module.exports = router;