import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // console.log(process.env.MONGO_URI);
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB:  ${conn.connection.host}` );

  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); //1 is failure, 0 is Success
  }
};

