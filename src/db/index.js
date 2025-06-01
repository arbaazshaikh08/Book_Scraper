import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectionIntence = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionIntence.connection.host}`
    );
  } catch (error) {
    console.log("Database connection failed:", error.message);
  }
};

export default connectDB;