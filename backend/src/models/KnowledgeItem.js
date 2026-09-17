import mongoose from "mongoose";

const sourceSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: false });

const knowledgeItemSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  blocks: { type: [mongoose.Schema.Types.Mixed], required: true },
  sources: { type: [sourceSchema], default: [] },
  reviewedAt: { type: Date, required: true }
}, { timestamps: true });

export const KnowledgeItem = mongoose.model("KnowledgeItem", knowledgeItemSchema);
