import express from 'express';
import categoryRoutes from './routes/categoryRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/items', itemRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to the Inventory Management API',
    endpoints: {
      categories: '/api/categories',
      items: '/api/items'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Error handling middleware
app.use(errorHandler);

export default app;
