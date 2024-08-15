import mongoose from "mongoose";
const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    attachment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
    deadlineDate: {
      type: String,
    },
    comments: [
      {
        content: {
          type: String,
          required: true,
        },
        userID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        uName: {
          type: String,
          required: true,
        },
        Timestamp: true,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    creatorName: String,
    assignedToName: String,
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
const Task = mongoose.model("Task", TaskSchema);
export default Task;
