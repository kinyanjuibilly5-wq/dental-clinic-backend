const express = require('express');
const auth = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const Appointment = require('../models/Appointment');
const router = express.Router();

router.get('/appointment-report', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('client dentist');
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=appointments.pdf');
    doc.pipe(res);

    doc.fontSize(18).text('Appointment Report', { align: 'center' });
    doc.moveDown();

    appointments.forEach(apt => {
      doc.fontSize(12).text(`Client: ${apt.client.name} (${apt.client.phone})`);
      doc.text(`Dentist: ${apt.dentist.name} | Date: ${apt.date.toDateString()} ${apt.time}`);
      doc.text(`Status: ${apt.status}`);
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;