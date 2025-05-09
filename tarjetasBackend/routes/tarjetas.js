const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const stripe = require('stripe')('clavePrivada'); // Reemplaza con tu clave secreta
const db = require('../database');
=======
const db = require('../database');
const validator = require('validator');
const axios = require('axios');
>>>>>>> parent of 2968b7e4 (cambios en el fronted e intento de creacion de tarjetas con stripe)

// Crear una nueva tarjeta de crédito
router.post('/', async (req, res) => {
    const { cardType, cardNumber, cvv, userId } = req.body;

    if (!cardType || !['Visa', 'MasterCard'].includes(cardType)) {
        return res.status(400).json({ error: 'Tipo de tarjeta inválido' });
    }
    if (!cardNumber || !validator.isCreditCard(cardNumber)) {
        return res.status(400).json({ error: 'Número de tarjeta de crédito inválido. Formato: XXXX XXXX XXXX XXXX' });
    }
    if (!cvv || !validator.isNumeric(cvv) || cvv.length !== 3) {
        return res.status(400).json({ error: 'CVV inválido' });
    }
    if (!userId || !validator.isNumeric(userId.toString())) {
        return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    try {
        const userResponse = await axios.get(`http://localhost:3000/users/profile/${userId}`);
        if (!userResponse.data) {
            return res.status(400).json({ error: 'ID de usuario no válido' });
        }

        db.run('INSERT INTO CreditCard(cardType, cardNumber, cvv, userId) VALUES(?, ?, ?, ?)', [cardType, cardNumber, cvv, userId], function(err) {
            if (err) {
                console.error('Error insertando tarjeta de crédito', err.message);
                return res.status(500).json({ error: 'Error insertando tarjeta de crédito' });
            }
            res.status(201).json({ message: 'Tarjeta de crédito creada', cardId: this.lastID });
        });
    } catch (error) {
        console.error('Error validando el ID de usuario', error.message);
        res.status(500).json({ error: 'Error validando el ID de usuario' });
    }
});
router.post('/verify', (req, res) => {
    const { cardNumber, cvv } = req.body;
  
    // Validar los datos recibidos
    if (!cardNumber || !cvv) {
      return res.status(400).json({ error: 'Número de tarjeta y CVV son requeridos' });
    }
  
    // Buscar la tarjeta en la base de datos
    db.get('SELECT * FROM CreditCard WHERE cardNumber = ? AND cvv = ?', [cardNumber, cvv], (err, row) => {
      if (err) {
        console.error('Error verificando la tarjeta', err.message);
        return res.status(500).json({ error: 'Error verificando la tarjeta' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Tarjeta no encontrada o CVV incorrecto' });
      }
      res.status(200).json({ message: 'Tarjeta verificada con éxito' });
    });
});
// Obtener todas las tarjetas de crédito
router.get('/', (req, res) => {
    db.all('SELECT * FROM CreditCard', (err, rows) => {
        if (err) {
            console.error('Error obteniendo tarjetas de crédito', err.message);
            res.status(500).json({ error: 'Error obteniendo tarjetas de crédito' });
        }
        res.json(rows);
    });
});

// Obtener tarjetas de crédito por userId
router.get('/user', (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        return res.status(400).json({ error: 'ID de usuario requerido' });
    }

    db.all('SELECT * FROM CreditCard WHERE userId = ?', [userId], (err, rows) => {
        if (err) {
            console.error('Error obteniendo tarjetas de crédito', err.message);
            res.status(500).json({ error: 'Error obteniendo tarjetas de crédito' });
        }
        res.json(rows);
    });
});

// Borrar tarjeta de crédito por su ID
router.delete('/:cardId', (req, res) => {
    const { cardId } = req.params;
    db.run('DELETE FROM CreditCard WHERE id=?', [cardId], function(err) {
        if (err) {
            console.error('Error borrando tarjeta de crédito', err.message);
            return res.status(500).json({ error: 'Error borrando tarjeta de crédito' });
        }
        res.status(200).json({ message: 'Tarjeta de crédito borrada' });
    });
});

router.post('/create-virtual-card', async (req, res) => {
  const { userId, name, email, billingAddress } = req.body;

  try {
    // Generar un número de teléfono válido para España
    const generateSpanishPhoneNumber = () => {
      const countryCode = '+34'; // Código de país para España
      const length = 9; // Longitud típica de números de teléfono en España
      const randomNumber = Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
      return `${countryCode}${randomNumber}`;
    };

    const phoneNumber = generateSpanishPhoneNumber();

    // Crear un cardholder vinculado al usuario
    const cardholder = await stripe.issuing.cardholders.create({
      name,
      email,
      phone_number: phoneNumber, // Número de teléfono válido
      type: 'individual',
      billing: {
        address: billingAddress,
      },
    });

    // Crear una tarjeta virtual vinculada al cardholder
    const card = await stripe.issuing.cards.create({
      cardholder: cardholder.id,
      currency: 'eur',
      type: 'virtual',
    });

    db.run(
      `UPDATE User SET cardholderId = ? WHERE id = ?`,
      [cardholder.id, userId],
      (err) => {
        if (err) {
          console.error('Error guardando el cardholderId en la base de datos:', err.message);
          return res.status(500).json({ error: 'Error guardando el cardholderId en la base de datos' });
        }
      }
    );
    db.run(
      `INSERT INTO CreditCard (cardType, cardNumber, balance, cardholderId, userId) VALUES (?, ?, ?, ?, ?)`,
      ['virtual', card.last4, 0, cardholder.id, userId],
      (err) => {
        if (err) {
          console.error('Error guardando la tarjeta en la tabla CreditCard:', err.message);
          return res.status(500).json({ error: 'Error guardando la tarjeta en la tabla CreditCard' });
        }

        res.status(201).json({ message: 'Tarjeta virtual creada', card });
      }
    );

    res.status(201).json({ message: 'Tarjeta virtual creada', card });
  } catch (error) {
    console.error('Error creando tarjeta virtual:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get('/get-user-cards', async (req, res) => {
  const { cardholder } = req.query; // Obtener el userId de los parámetros de la consulta

  try {
    // Aquí puedes consultar tu base de datos para obtener las tarjetas del usuario
    // Si no tienes una base de datos, puedes usar la API de Stripe para listar las tarjetas
    const cards = await stripe.issuing.cards.list({
      cardholder: cardholder, // Filtrar por el cardholder (userId)
    });

    res.status(200).json({ cards: cards.data });
  } catch (error) {
    console.error('Error obteniendo tarjetas:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/add-balance', async (req, res) => {
  const { cardId, amount } = req.body;

  try {
    // Actualizar el saldo de la tarjeta en la base de datos
    db.run(
      `UPDATE CreditCard SET balance = balance + ? WHERE id = cardholders.id AND cardholders.cardholderId = ?`,
      [amount, cardId],
      (err) => {
        if (err) {
          console.error('Error añadiendo saldo a la tarjeta:', err.message);
          return res.status(500).json({ error: 'Error añadiendo saldo a la tarjeta' });
        }

        res.status(200).json({ message: 'Saldo añadido con éxito' });
      }
    );
  } catch (error) {
    console.error('Error añadiendo saldo:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;