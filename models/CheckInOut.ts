import mongoose, { model, Schema } from "mongoose";
const CheckInOutSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  history: [
    {
      checkInTime: { type: Date, required: true },
      checkOutTime: { type: Date, default: null },
    },
  ],
});
export const CheckInOut = model("CheckInOut", CheckInOutSchema);
//
