import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes';
import { supabaseAdmin } from './config/database';

// Load environment variables
dotenv.config();

const app = express();

// Early request logging - before any middleware
app.use((req, res, next) => {
  console.log('\n🔥 INCOMING REQUEST DETECTED 🔥');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Query:', req.query);
  next();
});

// Custom logging middleware
const requestLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`\n=== 🌐 Incoming ${req.method} Request ===`);
  console.log('📍 URL:', req.url);
  console.log('📦 Body:', req.method === 'POST' ? { ...req.body, password: '[REDACTED]' } : req.body);
  console.log('🔑 Headers:', {
    ...req.headers,
    authorization: req.headers.authorization ? '[REDACTED]' : undefined
  });
  
  // Capture the original send function
  const originalSend = res.send;
  res.send = function (body: any) {
    console.log('\n=== 📤 Outgoing Response ===');
    console.log('📊 Status:', res.statusCode);
    console.log('📦 Body:', typeof body === 'string' ? JSON.parse(body) : body);
    console.log('=== ✨ End Request ===\n');
    return originalSend.call(this, body);
  };
  
  next();
};

// Test database connection
async function testDbConnection() {
  try {
    console.log('\n=== 🔌 Testing Database Connection ===');
    const { data, error } = await supabaseAdmin.from('users').select('count').single();
    if (error) throw error;
    console.log('✅ Database connection successful');
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    return false;
  }
}

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400 // 24 hours
}));

// Move express.json() before routes to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(morgan('dev'));
app.use(requestLogger);

// Routes
app.use('/api', routes);

// 404 handler
app.use((req, res, next) => {
  console.log('❌ Route not found:', req.originalUrl);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('\n=== ❌ Global Error Handler ===');
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    code: err.code,
    details: err.details
  });
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      error: err.stack,
      details: err.details
    })
  });
  
  console.log('=== ✨ End Error Handler ===\n');
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Start server
async function startServer() {
  try {
    console.log('\n=== 🚀 Starting Server ===');
    console.log('📝 Environment:', process.env.NODE_ENV);
    console.log('🌐 Frontend URL:', process.env.FRONTEND_URL);
    
    const dbConnected = await testDbConnection();
    if (!dbConnected) {
      throw new Error('Database connection failed');
    }
    
    app.listen(PORT, HOST, () => {
      console.log(`
✨ Server is ready!
🚪 Port: ${PORT}
🏠 Host: ${HOST}
📝 Mode: ${process.env.NODE_ENV}
🔗 API URL: http://${HOST}:${PORT}/api
🌐 Frontend URL: ${process.env.FRONTEND_URL}
      `);
    });
  } catch (err) {
    console.error('\n❌ Failed to start server:', err);
    process.exit(1);
  }
}

// Add error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

startServer(); 