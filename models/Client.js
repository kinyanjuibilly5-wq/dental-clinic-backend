const { readDB, writeDB } = require('../db/db');

const Client = {
  findOne: async (query) => {
    const db = readDB();
    const key = Object.keys(query)[0];
    const value = query[key];
    return db.clients.find(c => c[key] === value);
  },
  find: async () => {
    const db = readDB();
    return db.clients;
  },
  create: async (data) => {
    const db = readDB();
    const newClient = { _id: Date.now().toString(), ...data };
    db.clients.push(newClient);
    writeDB(db);
    return newClient;
  }
};

module.exports = Client;
