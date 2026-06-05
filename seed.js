const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seed = async () => {
  await User.deleteMany();
  const hashed = await bcrypt.hash('password123', 10);
  await User.create({ name: 'Dr. Smith', badge: 'D001', password: hashed, role: 'dentist' });
  await User.create({ name: 'Nurse Anna', badge: 'N001', password: hashed, role: 'nurse' });
  console.log('✅ Users created');
  process.exit();
};
seed();
