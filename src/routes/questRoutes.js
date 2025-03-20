import express from 'express';
import Quest from '../models/quest.js';

const router = express.Router();

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

router.get('/', async (req, res) => {
  try {
    let { page = 1, limit = 6 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || isNaN(limit)) {
      return res.status(400).json({ message: 'Invalid page or limit value' });
    }

    const totalQuizzes = await Quest.countDocuments();
    const quizzes = await Quest.find()
      .skip((page - 1) * limit)
      .limit(limit);

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

router.delete('/:id', async (req, res) => {
  await Quest.findByIdAndDelete(req.params.id);
  res.json({ message: 'Questionnaire deleted' });
});

export default router;

// import express from 'express';
// import Quest from '../models/Quest.js';

// const router = express.Router();

// router.post('/', async (req, res) => {
//   try {
//     const { title, description, questions } = req.body;

//     const formattedQuestions = questions.map((q) => ({
//       text: q.text || 'Untitled question',
//       type: q.type,
//       choices: q.choices || [],
//       correctAnswers:
//         q.type === 'multiple'
//           ? q.correctAnswers || []
//           : [q.correctAnswer || ''],
//     }));

//     const newQuiz = new Quest({
//       title,
//       description,
//       questions: formattedQuestions,
//     });
//     await newQuiz.save();

//     res.status(201).json(newQuiz);
//   } catch (error) {
//     console.error('Error saving quiz:', error);
//     res.status(500).json({ message: 'Failed to save quiz' });
//   }
// });

// router.get('/', async (req, res) => {
//   try {
//     let { page = 1, limit = 6 } = req.query;
//     page = parseInt(page);
//     limit = parseInt(limit);

//     if (isNaN(page) || isNaN(limit)) {
//       return res.status(400).json({ message: 'Invalid page or limit value' });
//     }

//     const totalQuizzes = await Quest.countDocuments();
//     const quizzes = await Quest.find()
//       .skip((page - 1) * limit)
//       .limit(limit);

//     res.json({
//       quizzes: quizzes,
//       hasMore: page * limit < totalQuizzes,
//     });
//   } catch (error) {
//     console.error('Error loading quizzes:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.get('/:id', async (req, res) => {
//   try {
//     const quiz = await Quest.findById(req.params.id);

//     if (!quiz) {
//       return res.status(404).json({ message: 'Quiz not found' });
//     }

//     res.json(quiz);
//   } catch (error) {
//     console.error('Error fetching quiz:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.put('/:id', async (req, res) => {
//   try {
//     const { title, description, questions } = req.body;

//     const formattedQuestions = questions.map((q) => ({
//       text: q.text || 'Untitled question',
//       type: q.type,
//       choices: q.choices || [],
//       correctAnswer:
//         q.type === 'multiple' ? q.correctAnswer || [] : [q.correctAnswer || ''],
//     }));

//     const updatedQuiz = await Quest.findByIdAndUpdate(
//       req.params.id,
//       { title, description, questions: formattedQuestions },
//       { new: true },
//     );

//     res.json(updatedQuiz);
//   } catch (error) {
//     console.error('Error updating quiz:', error);
//     res.status(500).json({ message: 'Failed to update quiz' });
//   }
// });

// router.get('/:id/edit', async (req, res) => {
//   try {
//     const quiz = await Quest.findById(req.params.id);
//     if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
//     res.json(quiz);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.delete('/:id', async (req, res) => {
//   await Quest.findByIdAndDelete(req.params.id);
//   res.json({ message: 'Questionnaire deleted' });
// });

// export default router;
