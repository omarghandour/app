import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URI as string;

  if (!mongoURI) {
    console.error("MongoDB URI is not defined in the environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
