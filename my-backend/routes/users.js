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
// Login de usuario
router.post('/login', (req, res) => {
  const { name, password } = req.body;
  console.log('Datos recibidos para login:', req.body);
  if (!name || !password) {
    return res.status(400).json({ error: 'Nombre y contraseña son requeridos' });
  }
  db.get(
    'SELECT id, isAdmin, isDisabled FROM User WHERE name = ? AND password = ?',
    [name, password],
    (err, row) => {
      if (err) {
        console.error('Error autenticando usuario:', err.message);
        return res.status(500).json({ error: 'Error autenticando usuario' });
      }
      if (!row) {
        return res.status(401).json({ error: 'Nombre o contraseña incorrectos' });
      }
      if (row.isDisabled === 1) {
        return res.status(403).json({ error: 'Usuario deshabilitado' });
      }
      res.status(200).json({ userId: row.id, isAdmin: row.isAdmin === 1 });
    }
  );
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

  const date = new Date().toISOString();

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

      // Registrar la transacción en la tabla UserTransaction
      db.run(
        'INSERT INTO UserTransaction (userId, amount, type, date) VALUES (?, ?, ?, ?)',
        [userId, amount, 'top-up', date],
        function (err) {
          if (err) {
            console.error('Error registrando la transacción:', err.message);
            return res.status(500).json({ error: 'Error registrando la transacción' });
          }
          res.status(200).json({ message: 'Saldo añadido con éxito', transactionId: this.lastID });
        }
      );
    }
  );
});

router.post('/transactions', (req, res) => {
  const { userId, amount, type } = req.body;

  if (!userId || !amount || !type) {
    return res.status(400).json({ error: 'Todos los campos (userId, amount, type) son requeridos' });
  }

  const date = new Date().toISOString();

  db.run(
    'INSERT INTO Transaction (userId, amount, type, date) VALUES (?, ?, ?, ?)',
    [userId, amount, type, date],
    function (err) {
      if (err) {
        console.error('Error registrando la transacción:', err.message);
        return res.status(500).json({ error: 'Error registrando la transacción' });
      }
      res.status(201).json({ message: 'Transacción registrada con éxito', transactionId: this.lastID });
    }
  );
});

// Endpoint para deshabilitar un usuario
router.put('/disable/:userId', (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'ID de usuario requerido' });
  }

  db.run(
    'UPDATE User SET isDisabled = 1 WHERE id = ?',
    [userId],
    function (err) {
      if (err) {
        console.error('Error deshabilitando usuario:', err.message);
        return res.status(500).json({ error: 'Error deshabilitando usuario' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.status(200).json({ message: 'Usuario deshabilitado correctamente' });
    }
  );
});

// Endpoint para habilitar un usuario
router.put('/enable/:userId', (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'ID de usuario requerido' });
  }

  db.run(
    'UPDATE User SET isDisabled = 0 WHERE id = ?',
    [userId],
    function (err) {
      if (err) {
        console.error('Error habilitando usuario:', err.message);
        return res.status(500).json({ error: 'Error habilitando usuario' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.status(200).json({ message: 'Usuario habilitado correctamente' });
    }
  );
});

router.get('/transactions/:userId', (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'ID de usuario requerido' });
  }

  db.all(
    'SELECT * FROM UserTransaction WHERE userId = ? ORDER BY date DESC LIMIT 5',
    [userId],
    (err, rows) => {
      if (err) {
        console.error('Error obteniendo transacciones:', err.message);
        return res.status(500).json({ error: 'Error obteniendo transacciones' });
      }
      res.json(rows);
    }
  );
});
module.exports = router;