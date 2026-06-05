const express = require('express');
const auth = require('../middleware/auth');
const Client = require('../models/Client');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const clients = await Client.find();
  res.json(clients);
});

router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'dentist') return res.status(403).json({ msg: 'Access denied' });
  const { name, phone, email } = req.body;
  const client = await Client.create({ name, phone, email });
  res.json(client);
});

router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'dentist') return res.status(403).json({ msg: 'Access denied' });
  const { name, phone, email } = req.body;
  const db = require('../db/db').readDB();
  const index = db.clients.findIndex(c => c._id === req.params.id);
  if (index === -1) return res.status(404).json({ msg: 'Client not found' });
  db.clients[index] = { ...db.clients[index], name, phone, email };
  require('../db/db').writeDB(db);
  res.json(db.clients[index]);
});

router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'dentist') return res.status(403).json({ msg: 'Access denied' });
  const db = require('../db/db').readDB();
  const newClients = db.clients.filter(c => c._id !== req.params.id);
  if (newClients.length === db.clients.length) return res.status(404).json({ msg: 'Client not found' });
  db.clients = newClients;
  require('../db/db').writeDB(db);
  res.json({ msg: 'Client deleted' });
});

module.exports = router;
