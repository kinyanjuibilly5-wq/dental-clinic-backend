const express = require('express');
const auth = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const Appointment = require('../models/Appointment');
const { readDB } = require('../db/db');
const router = express.Router();

router.get('/appointment-report', auth, async (req, res) => {
  try {
    let appointments = await Appointment.find();
    const db = readDB();
    appointments = appointments.map(apt => ({
      ...apt,
      client: db.clients.find(c => c._id === apt.clientId),
      dentist: db.users.find(u => u._id === apt.dentistId)
    }));

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=appointments.pdf');
    doc.pipe(res);

    doc.fontSize(18).text('Appointment Report', { align: 'center' });
    doc.moveDown();
    appointments.forEach(apt => {
      doc.fontSize(12).text(`Client: ${apt.client?.name || 'N/A'} (${apt.client?.phone || 'N/A'})`);
      doc.text(`Dentist: ${apt.dentist?.name || 'N/A'} | Date: ${apt.date} ${apt.time}`);
      doc.text(`Status: ${apt.status || 'scheduled'}`);
      doc.moveDown();
    });
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;