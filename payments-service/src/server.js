const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const paymentsRoutes = require('./routes/paymentsRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/payments', paymentsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Payments Service is running' });
});

app.listen(PORT, () => {
  console.log(`Payments Service running on port ${PORT}`);
});