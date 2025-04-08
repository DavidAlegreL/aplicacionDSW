const express = require('express');
const router = express.Router();
const db = require('../database');
const validator = require('validator');
const axios = require('axios');

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

module.exports = router;