import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import lessonPlanRoutes from './routes/lessonPlans.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    service: 'lesson-plan-api',
    status: 'running',
    health: '/health',
    api_base: '/api/v1/lesson-plans'
  });
});

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/v1/lesson-plans', lessonPlanRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  return res.status(500).json({ message: '未預期錯誤', detail: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
