import express from 'express';
import Result from '../models/result.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { quizId, answers, timeTaken, correctCount } = req.body;

    // Валидация
    if (
      !quizId ||
      !answers ||
      typeof timeTaken !== 'number' ||
      typeof correctCount !== 'number'
    ) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    const newResult = new Result({
      quizId,
      answers,
      timeTaken,
      correctCount,
    });
    await newResult.save();
    res.status(201).json(newResult);
  } catch (error) {
    console.error('Error saving result:', error);
    res.status(500).json({ message: 'Failed to save result' });
  }
});

export default router;
