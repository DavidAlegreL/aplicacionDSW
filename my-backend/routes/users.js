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

// Endpoint para solicitar dinero
router.post('/request-money', (req, res) => {
  const { userId, friendId, amount } = req.body;

  if (!userId || !friendId || amount == null || amount <= 0) {
    return res.status(400).json({ error: 'Todos los campos (userId, friendId, amount) son requeridos' });
  }

  // Registrar la solicitud de dinero en la base de datos
  db.run(
    'INSERT INTO MoneyRequests (requesterId, responderId, amount, status) VALUES (?, ?, ?, ?)',
    [userId, friendId, amount, 'pending'],
    function (err) {
      if (err) {
        console.error('Error registrando la solicitud de dinero:', err.message);
        return res.status(500).json({ error: 'Error registrando la solicitud de dinero' });
      }
      res.status(201).json({ message: 'Solicitud de dinero registrada con éxito', requestId: this.lastID });
    }
  );
});

router.put('/request-money/:requestId', (req, res) => {
  const { requestId } = req.params;
  const { action } = req.body; // 'accept' o 'reject'

  if (!requestId || !action) {
    return res.status(400).json({ error: 'ID de solicitud y acción son requeridos' });
  }

  const newStatus = action === 'accept' ? 'accepted' : 'rejected';

  db.get(
    'SELECT requesterId, responderId, amount FROM MoneyRequests WHERE id = ? AND status = "pending"',
    [requestId],
    (err, request) => {
      if (err) {
        console.error('Error obteniendo solicitud de dinero:', err.message);
        return res.status(500).json({ error: 'Error obteniendo solicitud de dinero' });
      }
      if (!request) {
        return res.status(404).json({ error: 'Solicitud no encontrada o ya procesada' });
      }

      if (action === 'accept') {
        db.serialize(() => {
          // Restar el monto del balance del usuario que acepta la solicitud
          db.run(
            'UPDATE User SET balance = balance - ? WHERE id = ?',
            [request.amount, request.responderId],
            function (err) {
              if (err) {
                console.error('Error actualizando balance del usuario que acepta:', err.message);
                return res.status(500).json({ error: 'Error actualizando balance' });
              }
            }
          );

          // Sumar el monto al balance del usuario que solicitó el dinero
          db.run(
            'UPDATE User SET balance = balance + ? WHERE id = ?',
            [request.amount, request.requesterId],
            function (err) {
              if (err) {
                console.error('Error actualizando balance del usuario que solicitó:', err.message);
                return res.status(500).json({ error: 'Error actualizando balance' });
              }
            }
          );

          // Registrar la transacción en la tabla UserTransaction
          const date = new Date().toISOString();
          db.run(
            'INSERT INTO UserTransaction (userId, amount, type, date) VALUES (?, ?, ?, ?)',
            [request.responderId, -request.amount, 'transfer', date],
            function (err) {
              if (err) {
                console.error('Error registrando transacción del usuario que acepta:', err.message);
                return res.status(500).json({ error: 'Error registrando transacción' });
              }
            }
          );

          db.run(
            'INSERT INTO UserTransaction (userId, amount, type, date) VALUES (?, ?, ?, ?)',
            [request.requesterId, request.amount, 'received', date],
            function (err) {
              if (err) {
                console.error('Error registrando transacción del usuario que solicitó:', err.message);
                return res.status(500).json({ error: 'Error registrando transacción' });
              }
            }
          );

          // Actualizar el estado de la solicitud
          db.run(
            'UPDATE MoneyRequests SET status = ? WHERE id = ?',
            [newStatus, requestId],
            function (err) {
              if (err) {
                console.error('Error actualizando estado de la solicitud:', err.message);
                return res.status(500).json({ error: 'Error actualizando estado de la solicitud' });
              }
              res.status(200).json({ message: `Solicitud de dinero ${action === 'accept' ? 'aceptada' : 'rechazada'}` });
            }
          );
        });
      } else {
        // Si la solicitud es rechazada, solo actualizamos el estado
        db.run(
          'UPDATE MoneyRequests SET status = ? WHERE id = ?',
          [newStatus, requestId],
          function (err) {
            if (err) {
              console.error('Error actualizando estado de la solicitud:', err.message);
              return res.status(500).json({ error: 'Error actualizando estado de la solicitud' });
            }
            res.status(200).json({ message: 'Solicitud de dinero rechazada' });
          }
        );
      }
    }
  );
});

// Endpoint para obtener solicitudes de dinero pendientes
router.get('/money-requests/:userId', (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'ID de usuario requerido' });
  }

  db.all(
    'SELECT mr.id, mr.requesterId, u.name AS requesterName, mr.amount, mr.status ' +
    'FROM MoneyRequests mr ' +
    'JOIN User u ON mr.requesterId = u.id ' +
    'WHERE mr.responderId = ? AND mr.status = "pending"',
    [userId],
    (err, rows) => {
      if (err) {
        console.error('Error obteniendo solicitudes de dinero:', err.message);
        return res.status(500).json({ error: 'Error obteniendo solicitudes de dinero' });
      }
      res.json(rows);
    }
  );
});

router.get('/friends/:userId', (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'ID de usuario requerido' });
  }

  db.all(
    `SELECT u.id, u.name FROM Friends f
     JOIN User u ON f.friendId = u.id
     WHERE f.userId = ?`,
    [userId],
    (err, rows) => {
      if (err) {
        console.error('Error obteniendo amigos:', err.message);
        return res.status(500).json({ error: 'Error obteniendo amigos' });
      }
      res.json(rows);
    }
  );
});

router.post('/transfer', (req, res) => {
  const { userId, friendId, amount } = req.body;

  if (!userId || !friendId || amount == null || amount <= 0) {
    return res.status(400).json({ error: 'Todos los campos (userId, friendId, amount) son requeridos' });
  }

  db.serialize(() => {
    // Verificar si el usuario tiene saldo suficiente
    db.get('SELECT balance FROM User WHERE id = ?', [userId], (err, row) => {
      if (err) {
        console.error('Error verificando saldo:', err.message);
        return res.status(500).json({ error: 'Error verificando saldo' });
      }
      if (!row || row.balance < amount) {
        return res.status(400).json({ error: 'Saldo insuficiente' });
      }

      // Restar el saldo del usuario
      db.run('UPDATE User SET balance = balance - ? WHERE id = ?', [amount, userId], function (err) {
        if (err) {
          console.error('Error restando saldo:', err.message);
          return res.status(500).json({ error: 'Error restando saldo' });
        }

        // Añadir el saldo al amigo
        db.run('UPDATE User SET balance = balance + ? WHERE id = ?', [amount, friendId], function (err) {
          if (err) {
            console.error('Error añadiendo saldo al amigo:', err.message);
            return res.status(500).json({ error: 'Error añadiendo saldo al amigo' });
          }

          // Registrar la transacción
          const date = new Date().toISOString();
          db.run(
            'INSERT INTO UserTransaction (userId, amount, type, date) VALUES (?, ?, ?, ?)',
            [userId, -amount, 'transfer', date]
          );
          db.run(
            'INSERT INTO UserTransaction (userId, amount, type, date) VALUES (?, ?, ?, ?)',
            [friendId, amount, 'received', date]
          );

          res.status(200).json({ message: 'Transferencia realizada con éxito' });
        });
      });
    });
  });
});
router.post('/friends/add', (req, res) => {
  const { userId, friendName } = req.body;

  if (!userId || !friendName) {
    return res.status(400).json({ error: 'ID de usuario y nombre del amigo son requeridos' });
  }

  // Buscar el ID del amigo por su nombre
  db.get('SELECT id FROM User WHERE name = ?', [friendName], (err, row) => {
    if (err) {
      console.error('Error buscando amigo:', err.message);
      return res.status(500).json({ error: 'Error buscando amigo' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Amigo no encontrado' });
    }

    const friendId = row.id;

    // Verificar si el usuario está intentando agregarse a sí mismo
    if (parseInt(userId) === friendId) {
      return res.status(400).json({ error: 'No puedes agregarte a ti mismo como amigo' });
    }

    // Verificar si ya son amigos
    db.get(
      'SELECT * FROM Friends WHERE userId = ? AND friendId = ?',
      [userId, friendId],
      (err, existingRow) => {
        if (err) {
          console.error('Error verificando amistad:', err.message);
          return res.status(500).json({ error: 'Error verificando amistad' });
        }
        if (existingRow) {
          return res.status(400).json({ error: 'Ya son amigos' });
        }

        // Insertar la relación de amistad
        db.run(
          'INSERT INTO Friends (userId, friendId) VALUES (?, ?)',
          [userId, friendId],
          function (err) {
            if (err) {
              console.error('Error añadiendo amigo:', err.message);
              return res.status(500).json({ error: 'Error añadiendo amigo' });
            }
            res.status(201).json({ message: 'Amigo añadido con éxito' });
          }
        );
      }
    );
  });
});
// Endpoint para solicitar dinero
router.post('/request-money', (req, res) => {
  const { userId, friendId, amount } = req.body;

  if (!userId || !friendId || amount == null || amount <= 0) {
    return res.status(400).json({ error: 'Todos los campos (userId, friendId, amount) son requeridos' });
  }

  // Registrar la solicitud de dinero en la base de datos
  db.run(
    'INSERT INTO MoneyRequests (requesterId, responderId, amount, status) VALUES (?, ?, ?, ?)',
    [userId, friendId, amount, 'pending'],
    function (err) {
      if (err) {
        console.error('Error registrando la solicitud de dinero:', err.message);
        return res.status(500).json({ error: 'Error registrando la solicitud de dinero' });
      }
      res.status(201).json({ message: 'Solicitud de dinero registrada con éxito', requestId: this.lastID });
    }
  );
});

// Endpoint para obtener el balance del usuario
router.get('/balance/:userId', (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'ID de usuario requerido' });
  }

  db.get('SELECT balance FROM User WHERE id = ?', [userId], (err, row) => {
    if (err) {
      console.error('Error obteniendo balance del usuario:', err.message);
      return res.status(500).json({ error: 'Error obteniendo balance del usuario' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json({ balance: row.balance });
  });
});

// Dividir un pago entre varios usuarios
router.post('/split-payment', (req, res) => {
  const { payerId, amount, participants } = req.body;

  if (!payerId || !amount || !participants || participants.length === 0) {
    return res.status(400).json({ error: 'Todos los campos (payerId, amount, participants) son requeridos' });
  }

  // Eliminar duplicados en los participantes
  const uniqueParticipants = [...new Set(participants)];

  const splitAmount = amount / uniqueParticipants.length;

  db.serialize(() => {
    // Verificar si todos los participantes tienen saldo suficiente
    const insufficientBalances = [];
    uniqueParticipants.forEach((participantId) => {
      db.get('SELECT balance FROM User WHERE id = ?', [participantId], (err, row) => {
        if (err) {
          console.error(`Error verificando saldo del participante ${participantId}:`, err.message);
          return res.status(500).json({ error: 'Error verificando saldo de los participantes' });
        }
        if (!row || row.balance < splitAmount) {
          insufficientBalances.push(participantId);
        }
      });
    });

    // Si algún participante no tiene saldo suficiente, devolver un error
    if (insufficientBalances.length > 0) {
      return res.status(400).json({
        error: 'Algunos participantes no tienen saldo suficiente',
        insufficientBalances,
      });
    }

    // Restar el monto dividido a cada participante
    uniqueParticipants.forEach((participantId) => {
      db.run('UPDATE User SET balance = balance - ? WHERE id = ?', [splitAmount, participantId], function (err) {
        if (err) {
          console.error(`Error restando saldo al participante ${participantId}:`, err.message);
        }
      });

      // Registrar la transacción para cada participante
      const date = new Date().toISOString();
      db.run(
        'INSERT INTO UserTransaction (userId, amount, type, date) VALUES (?, ?, ?, ?)',
        [participantId, -splitAmount, 'split-payment', date],
        function (err) {
          if (err) {
            console.error(`Error registrando transacción para el participante ${participantId}:`, err.message);
          }
        }
      );
    });

    res.status(200).json({ message: 'Pago dividido con éxito' });
  });
});

// Obtener el catálogo de productos
router.get('/catalog', (req, res) => {
  db.all(
    `SELECT id, name, description, price, image, store FROM Products`,
    [],
    (err, rows) => {
      if (err) {
        console.error('Error obteniendo el catálogo:', err.message);
        return res.status(500).json({ error: 'Error obteniendo el catálogo' });
      }
      res.status(200).json(rows);
    }
  );
});

// Realizar una compra y actualizar el saldo del usuario
router.post('/purchase', (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ error: 'El ID del usuario y del producto son requeridos' });
  }

  // Obtener el precio del producto
  db.get(
    `SELECT price FROM Products WHERE id = ?`,
    [productId],
    (err, product) => {
      if (err) {
        console.error('Error obteniendo el producto:', err.message);
        return res.status(500).json({ error: 'Error obteniendo el producto' });
      }

      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      const productPrice = product.price;

      // Obtener el saldo del usuario
      db.get(
        `SELECT balance FROM User WHERE id = ?`,
        [userId],
        (err, user) => {
          if (err) {
            console.error('Error obteniendo el saldo del usuario:', err.message);
            return res.status(500).json({ error: 'Error obteniendo el saldo del usuario' });
          }

          if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
          }

          const userBalance = user.balance;

          // Verificar si el usuario tiene suficiente saldo
          if (userBalance < productPrice) {
            return res.status(400).json({ error: 'Saldo insuficiente para realizar la compra' });
          }

          // Actualizar el saldo del usuario
          const newBalance = userBalance - productPrice;
          db.run(
            `UPDATE User SET balance = ? WHERE id = ?`,
            [newBalance, userId],
            (err) => {
              if (err) {
                console.error('Error actualizando el saldo del usuario:', err.message);
                return res.status(500).json({ error: 'Error actualizando el saldo del usuario' });
              }

              // Registrar la compra
              db.run(
                `INSERT INTO Purchases (userId, productId, quantity, totalPrice, date) VALUES (?, ?, ?, ?, datetime('now'))`,
                [userId, productId, 1, productPrice],
                (err) => {
                  if (err) {
                    console.error('Error registrando la compra:', err.message);
                    return res.status(500).json({ error: 'Error registrando la compra' });
                  }

                  res.status(200).json({ message: 'Compra realizada con éxito', newBalance });
                }
              );
            }
          );
        }
      );
    }
  );
});
// Obtener las últimas compras de un usuario
router.get('/purchases/:userId', (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'El ID del usuario es requerido' });
  }

  db.all(
    `SELECT pr.store AS storeName, pr.name AS productName, pr.price AS productPrice, t.date AS purchaseDate
     FROM Purchases t
     INNER JOIN Products pr ON t.productId = pr.id
     WHERE t.userId = ?
     ORDER BY t.date DESC
     LIMIT 10`,
    [userId],
    (err, rows) => {
      if (err) {
        console.error('Error obteniendo las compras:', err.message);
        return res.status(500).json({ error: 'Error obteniendo las compras' });
      }
      res.status(200).json(rows);
    }
  );
});

module.exports = router;