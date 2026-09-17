import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { finished } from "node:stream/promises";
import PDFDocument from "pdfkit";
import { allQuestionCategories, allTrainingQuestions } from "../src/data/allTrainingQuestions.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDirectory, "../..");
const outputDirectory = path.join(workspaceRoot, "docs");
const outputPath = path.join(outputDirectory, "Chativo-English-Roman-Urdu-Question-Catalog.pdf");

fs.mkdirSync(outputDirectory, { recursive: true });

const document = new PDFDocument({
  size: "A4",
  margins: { top: 54, right: 54, bottom: 54, left: 54 },
  bufferPages: true,
  info: {
    Title: "Chativo English and Roman Urdu Question Catalog",
    Author: "Chativo Product Assistant",
    Subject: "Supported customer questions and expected chatbot intents"
  }
});

const output = fs.createWriteStream(outputPath);
document.pipe(output);

document
  .fillColor("#172554")
  .font("Helvetica-Bold")
  .fontSize(24)
  .text("Chativo English and Roman Urdu Question Catalog");

document
  .moveDown(0.4)
  .fillColor("#475569")
  .font("Helvetica")
  .fontSize(11)
  .text(`${allTrainingQuestions.length} maintained questions across ${allQuestionCategories.length} language and intent categories.`)
  .moveDown(0.5)
  .text("This catalog is the chatbot's deterministic training set and its automated accuracy benchmark. Questions about undocumented Chativo details receive an unverified-detail response; unrelated questions are refused.")
  .moveDown(1.2);

let questionNumber = 1;

for (const category of allQuestionCategories) {
  if (document.y > 690) document.addPage();

  document
    .fillColor("#1d4ed8")
    .font("Helvetica-Bold")
    .fontSize(15)
    .text(category.title);

  document
    .fillColor("#64748b")
    .font("Helvetica-Oblique")
    .fontSize(9)
    .text(`Expected intent: ${category.intent}`)
    .moveDown(0.25)
    .font("Helvetica")
    .text(category.description)
    .moveDown(0.45);

  for (const question of category.questions) {
    document
      .fillColor("#0f172a")
      .font("Helvetica")
      .fontSize(10)
      .text(`${questionNumber}. ${question}`, { indent: 10, paragraphGap: 3 });
    questionNumber += 1;
  }

  document.moveDown(0.75);
}

const pageRange = document.bufferedPageRange();
for (let pageIndex = 0; pageIndex < pageRange.count; pageIndex += 1) {
  document.switchToPage(pageIndex);
  document
    .fillColor("#94a3b8")
    .font("Helvetica")
    .fontSize(8)
    .text(
      `Chativo question catalog  |  Page ${pageIndex + 1} of ${pageRange.count}`,
      54,
      document.page.height - 36,
      { width: document.page.width - 108, align: "center", lineBreak: false }
    );
}

document.end();
await finished(output);

console.log(`Generated ${outputPath}`);
console.log(`${allTrainingQuestions.length} questions across ${allQuestionCategories.length} categories.`);
