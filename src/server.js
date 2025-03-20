import express from 'express';
import cors from 'cors';
// import dotenv from 'dotenv';
import { env } from './utils/env.js';
import mongoose from 'mongoose';
import questRoutes from './routes/questRoutes.js';
import resultRoutes from './routes/resultRoutes.js';

const PORT = Number(env('PORT', '3000'));
export const setupServer = () => {
  // dotenv.config();
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use('/api/quests', questRoutes);
  app.use('/api/results', resultRoutes);

  //   mongoose
  //     .connect(process.env.MONGO_URI, {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //     })
  //     .then(() =>
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  // .catch((err) => console.log(err));
};
