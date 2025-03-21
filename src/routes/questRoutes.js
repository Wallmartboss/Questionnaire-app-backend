import express from 'express';
import Quest from '../models/Quest.js';
import Result from '../models/result.js'; // Импортируем модель Result

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let {
      page = 1,
      limit = 6,
      sortBy = 'title',
      sortOrder = 'asc',
    } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || isNaN(limit)) {
      return res.status(400).json({ message: 'Invalid page or limit value' });
    }

    const totalQuizzes = await Quest.countDocuments();

    let sortField;
    if (sortBy === 'name') {
      sortField = 'title';
    } else if (sortBy === 'questions') {
      sortField = 'questionsLength';
    } else if (sortBy === 'completions') {
      sortField = 'completions';
    } else {
      sortField = 'title';
    }

    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    const quizzes = await Quest.aggregate([
      {
        $addFields: {
          questionsLength: { $size: '$questions' },
        },
      },

      {
        $lookup: {
          from: 'results',
          localField: '_id',
          foreignField: 'quizId',
          as: 'results',
        },
      },
      {
        $addFields: {
          completions: { $size: '$results' },
        },
      },
      {
        $project: {
          results: 0,
        },
      },
      {
        $sort: {
          [sortField]: sortDirection,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ]);

    res.json({
      quizzes: quizzes,
      hasMore: page * limit < totalQuizzes,
    });
  } catch (error) {
    console.error('Error loading quizzes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quest.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    const updatedQuiz = await Quest.findByIdAndUpdate(
      req.params.id,
      { title, description, questions },
      { new: true, runValidators: true },
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(updatedQuiz);
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ message: 'Failed to update quiz' });
  }
});

router.get('/:id/edit', async (req, res) => {
  try {
    const quiz = await Quest.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/', async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    const newQuiz = new Quest({
      title,
      description,
      questions,
    });
    await newQuiz.save();

    res.status(201).json(newQuiz);
  } catch (error) {
    console.error('Error saving quiz:', error);
    res.status(500).json({ message: 'Failed to save quiz' });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const deletedQuiz = await Quest.findByIdAndDelete(req.params.id);

    if (!deletedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ message: 'Failed to delete quiz' });
  }
});

export default router;
