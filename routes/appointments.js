const express = require('express');
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Client = require('../models/Client');
const User = require('../models/User');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { clientName, clientPhone, dentistBadge, date, time, notes } = req.body;
    let client = await Client.findOne({ phone: clientPhone });
    if (!client) {
      client = await Client.create({ name: clientName, phone: clientPhone });
    }
    const dentists = await User.find({ badge: dentistBadge, role: 'dentist' });
    const dentist = dentists[0];
    if (!dentist) return res.status(400).json({ msg: 'Dentist not found' });
    const appointment = await Appointment.create({
      clientId: client._id,
      dentistId: dentist._id,
      date,
      time,
      notes,
      status: 'scheduled'
    });
    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    let appointments = await Appointment.find();
    const db = require('../db/db').readDB();
    appointments = appointments.map(apt => ({
      ...apt,
      client: db.clients.find(c => c._id === apt.clientId),
      dentist: db.users.find(u => u._id === apt.dentistId)
    }));
    if (req.user.role === 'dentist') {
      appointments = appointments.filter(apt => apt.dentist?._id === req.user.id);
    }
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
