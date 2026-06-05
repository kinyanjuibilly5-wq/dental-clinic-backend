const { readDB, writeDB } = require('../db/db');

const Appointment = {
  find: async () => {
    const db = readDB();
    return db.appointments;
  },
  findById: async (id) => {
    const db = readDB();
    return db.appointments.find(a => a._id === id);
  },
  create: async (data) => {
    const db = readDB();
    const newAppointment = { _id: Date.now().toString(), ...data };
    db.appointments.push(newAppointment);
    writeDB(db);
    return newAppointment;
  },
  populate: async (appointments) => {
    const db = readDB();
    return appointments.map(apt => ({
      ...apt,
      client: db.clients.find(c => c._id === apt.clientId),
      dentist: db.users.find(u => u._id === apt.dentistId)
    }));
  }
};

module.exports = Appointment;
