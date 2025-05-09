const express = require('express');
const router = express.Router();
const stripe = require('stripe')(''); // Reemplaza con tu clave secreta
const db = require('../database');

// Crear un método de pago (tarjeta)
router.post('/create-payment-method', async (req, res) => {
  const { cardNumber, expMonth, expYear, cvc } = req.body;

  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: cardNumber,
        exp_month: expMonth,
        exp_year: expYear,
        cvc: cvc,
      },
    });

    res.status(201).json({ message: 'Método de pago creado', paymentMethod });
  } catch (error) {
    console.error('Error creando método de pago:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Realizar un pago
router.post('/charge', async (req, res) => {
  const { amount, currency, paymentMethodId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      payment_method: paymentMethodId,
      confirm: true,
    });

    res.status(200).json({ message: 'Pago realizado con éxito', paymentIntent });
  } catch (error) {
    console.error('Error realizando el pago:', error.message);
    res.status(500).json({ error: error.message });
  }
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