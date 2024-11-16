import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import vesselRoutes from './routes/vessels.js';
import locationRoutes from './routes/locations.js';
import { initDb } from './db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

initDb();

app.use('/api/auth', authRoutes);
app.use('/api/vessels', vesselRoutes);
app.use('/api/locations', locationRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});