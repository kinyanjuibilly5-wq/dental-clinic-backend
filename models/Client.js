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
  },
  findByIdAndUpdate: async (id, update, options) => {
    const db = readDB();
    const index = db.clients.findIndex(c => c._id === id);
    if (index === -1) return null;
    db.clients[index] = { ...db.clients[index], ...update };
    writeDB(db);
    return db.clients[index];
  },
  findByIdAndDelete: async (id) => {
    const db = readDB();
    const index = db.clients.findIndex(c => c._id === id);
    if (index === -1) return null;
    const deleted = db.clients[index];
    db.clients.splice(index, 1);
    writeDB(db);
    return deleted;
  }
};

module.exports = Client;
