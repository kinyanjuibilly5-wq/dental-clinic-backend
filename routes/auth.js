const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { badge, password } = req.body;
  try {
    const user = await User.findOne({ badge });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    const payload = {
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        badge: user.badge
      }
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: payload.user });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

// TEMPORARY SEED ROUTE – remove after seeding
router.get('/seed', async (req, res) => {
  const bcrypt = require('bcryptjs');
  const User = require('../models/User');
  try {
    await User.deleteMany();
    const hashed = await bcrypt.hash('password123', 10);
    await User.create([
      { name: 'Dr. Smith', badge: 'D001', password: hashed, role: 'dentist' },
      { name: 'Nurse Anna', badge: 'N001', password: hashed, role: 'nurse' }
    ]);
    res.send('✅ Users created. You can now login with D001 / password123');
  } catch (err) {
    res.status(500).send('Error seeding: ' + err.message);
  }
});