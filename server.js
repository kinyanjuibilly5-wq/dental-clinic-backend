require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Routes (no Mongoose connection needed)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/generate', require('./routes/generate'));

app.get('/', (req, res) => res.send('Backend running with JSON DB'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(Server on port ));
