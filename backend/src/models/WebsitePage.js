import mongoose from "mongoose";

const websitePageSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true, index: true },
  path: { type: String, required: true, index: true },
  type: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  headings: { type: [String], default: [] },
  keyPoints: { type: [String], default: [] },
  chunks: { type: [String], required: true },
  wordCount: { type: Number, required: true },
  lastModified: { type: String, default: null },
  contentHash: { type: String, required: true, index: true },
  syncedAt: { type: Date, required: true }
}, {
  timestamps: true,
  versionKey: false
});

export const WebsitePage = mongoose.model("WebsitePage", websitePageSchema);

