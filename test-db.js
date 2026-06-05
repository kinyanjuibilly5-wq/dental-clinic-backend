require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ CONNECTED TO MONGODB!');
    process.exit();
  })
  .catch(err => {
    console.log('❌ ERROR:', err.message);
    process.exit();
  });
