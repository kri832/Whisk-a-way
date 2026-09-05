const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const reservationRoutes = require('./routes/reservations');
const userRoutes = require('./routes/users');
const contactRoutes = require('./routes/contacts');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Whisk-a-Way API is running');
});

app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const connected = dbState === 1;
  res.status(connected ? 200 : 503).json({
    ok: connected,
    database: connected ? 'connected' : 'connecting/disconnected',
    message: connected
      ? 'API and database are ready'
      : 'Database not connected. Check MONGO_URI and that MongoDB is running.',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);

const PORT = process.env.PORT || 5001;

// Resilient MongoDB Connection with Automatic Retry Loop
const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/whisk-a-way';
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Successfully connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection attempt failed:', err.message);
    console.log('Retrying MongoDB connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Retrying connection...');
  setTimeout(connectDB, 5000);
});

connectDB();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Whisk-a-Way API listening on port ${PORT}`);
});


