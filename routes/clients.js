const express = require('express');
const auth = require('../middleware/auth');
const Client = require('../models/Client');
const router = express.Router();

// Get all clients (any authenticated user)
router.get('/', auth, async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Add new client (only dentist)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'dentist') return res.status(403).json({ msg: 'Access denied' });
  try {
    const { name, phone, email } = req.body;
    const client = new Client({ name, phone, email });
    await client.save();
    res.json(client);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update client (only dentist)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'dentist') return res.status(403).json({ msg: 'Access denied' });
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) return res.status(404).json({ msg: 'Client not found' });
    res.json(client);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete client (only dentist)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'dentist') return res.status(403).json({ msg: 'Access denied' });
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ msg: 'Client not found' });
    res.json({ msg: 'Client deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
