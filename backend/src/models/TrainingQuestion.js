import mongoose from "mongoose";

const trainingQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  normalizedQuestion: { type: String, required: true, unique: true, index: true },
  intent: { type: String, required: true, index: true },
  category: { type: String, required: true },
  language: { type: String, enum: ["english", "roman_urdu"], required: true, index: true }
}, {
  timestamps: true,
  versionKey: false
});

export const TrainingQuestion = mongoose.model("TrainingQuestion", trainingQuestionSchema);
