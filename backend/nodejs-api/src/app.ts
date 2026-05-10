import express, { Express, Request, Response } from 'express';
import cors from 'cors';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'E-Traffic API is running' });
});

// Import routes
import authRoutes from './routes/authRoutes';
import fineRoutes from './routes/fineRoutes';
import userRoutes from './routes/userRoutes';
import messageRoutes from './routes/messageRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/fines', fineRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Catch-all 404 for API routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Not Found: ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export default app;
