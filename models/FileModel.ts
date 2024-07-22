import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: String,
    data: Buffer,
    contentType: String,
    task: { type: mongoose.Schema.ObjectId, ref: "Task" },
    user: mongoose.Schema.ObjectId,
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("File", fileSchema);

export default File;
