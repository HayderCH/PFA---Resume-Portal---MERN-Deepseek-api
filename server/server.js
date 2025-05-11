import './config/instrument.mjs';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from '@sentry/node';
import { clerkWebhooks } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js'; // Import candidate routes
import connectCloudinary from './config/cloudinary.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { clerkMiddleware } from '@clerk/express';

// Initialize express
const app = express();

// Connect to Database
await connectDB(); // Updated connectDB function to remove deprecated options
await connectCloudinary();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', function rootHandler(req, res) {
  res.send('API working');
});

app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error!');
});

app.post('/webhooks', express.raw({ type: '*/*' }), clerkWebhooks);

app.use('/api/company', companyRoutes); // Company-related routes
app.use('/api/candidate', candidateRoutes); // Candidate-related routes
app.use('/api/jobs', jobRoutes); // Job-related routes
app.use('/api/users', userRoutes); // User-related routes

// Port
const PORT = process.env.PORT || 5000;

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  console.error('Unhandled Error:', err.message);
  res.statusCode = 500;
  res.end(res.sentry + '\n');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});