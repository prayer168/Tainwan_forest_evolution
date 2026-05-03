import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import lessonPlanRoutes from './routes/lessonPlans.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/v1/lesson-plans', lessonPlanRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on :${port}`);
});
