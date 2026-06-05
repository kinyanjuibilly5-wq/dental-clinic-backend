const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['cash', 'card', 'online'], required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema);
