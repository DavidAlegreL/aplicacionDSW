const express = require('express');
const router = express.Router();
const db = require('../database');
const validator = require('validator');

// Crear una nueva tarjeta de crédito
router.post('/', (req, res) => {
    const { cardType, cardNumber, cvv } = req.body;

    // Validar los detalles de la tarjeta de crédito
    if (!cardType || !['Visa', 'MasterCard'].includes(cardType)) {
        return res.status(400).json({ error: 'Tipo de tarjeta inválido' });
    }
    if (!cardNumber || !validator.isCreditCard(cardNumber)) {
        return res.status(400).json({ error: 'Número de tarjeta de crédito inválido. Formato: XXXX XXXX XXXX XXXX' });
    }
    if (!cvv || !validator.isNumeric(cvv) || cvv.length !== 3) {
        return res.status(400).json({ error: 'CVV inválido' });
    }

    db.run('INSERT INTO CreditCard(cardType, cardNumber, cvv) VALUES(?, ?, ?)', [cardType, cardNumber, cvv], function(err) {
        if (err) {
            console.error('Error insertando tarjeta de crédito', err.message);
            return res.status(500).json({ error: 'Error insertando tarjeta de crédito' });
        }
        res.status(201).json({ message: 'Tarjeta de crédito creada', cardId: this.lastID });
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