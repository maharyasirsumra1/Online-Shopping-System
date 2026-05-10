const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const brandRoutes = require('./routes/brands');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use('/images', express.static(path.join(__dirname, '../product_images')));

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ message: 'Online Shop API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const startServer = (currentPort) => {
  const server = app.listen(currentPort, () => {
    console.log(`
  🚀 Server is running professionally!
  📡 Listening on: http://localhost:${currentPort}
  📂 Static Images: http://localhost:${currentPort}/images
    `);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${currentPort} is already in use. Attempting to start on port ${currentPort + 1}...`);
      startServer(currentPort + 1);
    } else {
      console.error('❌ Server failed to start:', err);
      process.exit(1);
    }
  });

  // Graceful shutdown handling
  process.on('SIGINT', () => {
    console.log('Closing server gracefully...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });
};

startServer(port);
