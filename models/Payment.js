const { readDB, writeDB } = require('../db/db');

const Payment = {
  create: async (data) => {
    const db = readDB();
    const newPayment = { _id: Date.now().toString(), ...data };
    db.payments.push(newPayment);
    writeDB(db);
    return newPayment;
  },
  find: async () => {
    const db = readDB();
    return db.payments;
  }
};

module.exports = Payment;
