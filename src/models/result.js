import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    answers: Object,
    timeTaken: Number,
    correctCount: Number,
  },
  { timestamps: true, versionKey: false },
);

const Result = mongoose.model('Result', ResultSchema);
export default Result;
