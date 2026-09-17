import { questionCategories, trainingQuestions } from "./questionCatalog.js";
import {
  romanUrduQuestionCategories,
  romanUrduTrainingQuestions
} from "./romanUrduQuestions.js";

const englishTrainingQuestions = trainingQuestions.map(question => ({
  ...question,
  language: "english"
}));

export const allQuestionCategories = [
  ...questionCategories,
  ...romanUrduQuestionCategories
];

export const allTrainingQuestions = [
  ...englishTrainingQuestions,
  ...romanUrduTrainingQuestions
];

