const { readDB, writeDB } = require('../db/db');

const User = {
  findOne: async (query) => {
    const db = readDB();
    const key = Object.keys(query)[0];
    const value = query[key];
    return db.users.find(u => u[key] === value);
  },
  find: async (query = {}) => {
    const db = readDB();
    let users = db.users;
    const key = Object.keys(query)[0];
    if (key) users = users.filter(u => u[key] === query[key]);
    return users;
  },
  create: async (data) => {
    const db = readDB();
    const newUser = { _id: Date.now().toString(), ...data };
    db.users.push(newUser);
    writeDB(db);
    return newUser;
  },
  deleteMany: async () => {
    const db = readDB();
    db.users = [];
    writeDB(db);
  }
};

module.exports = User;
