const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const clientRoutes = require('./routes/clientRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/clients', clientRoutes);
app.use('/api/orders', orderRoutes);

// Database Initialization (optional, usually done via SQL script)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Serve frontend in production
const path = require('path');
const _dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(_dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(_dirname, '../client/dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
