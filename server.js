require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'db.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(dbPath)) {
  const initialData = { users: [], clients: [], appointments: [], payments: [] };
  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
  console.log('? Created data/db.json');
}

app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/generate', require('./routes/generate'));

app.get('/', (req, res) => res.send('Backend running with file DB'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(? Server running on port ));
