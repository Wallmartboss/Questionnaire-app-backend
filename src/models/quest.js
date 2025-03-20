import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    type: {
      type: String,
      enum: ['text', 'single', 'multiple'],
      required: true,
    },
    choices: [String],
    correctAnswer: [String],
  },
  { timestamps: true, versionKey: false },
);

const QuestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    questions: [QuestionSchema],
  },
  { timestamps: true, versionKey: false },
);

const Quest = mongoose.model('Quest', QuestSchema);
export default Quest;
