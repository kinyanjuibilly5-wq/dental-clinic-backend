const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  dentist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, default: 'scheduled' },
  notes: { type: String }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
