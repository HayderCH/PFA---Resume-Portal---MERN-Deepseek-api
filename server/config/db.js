import mongoose from "mongoose";
import 'dotenv/config';

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    // Validate the MongoDB URI
    if (!uri || (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://"))) {
      throw new Error("Invalid MongoDB connection string. Ensure it starts with 'mongodb://' or 'mongodb+srv://'.");
    }

    // Connect to MongoDB without appending '/job-portal' if the URI already includes a database name
    await mongoose.connect(uri, {
      useNewUrlParser: true, // Deprecated, but safe to remove in MongoDB driver 4.0+
      useUnifiedTopology: true, // Deprecated, but safe to remove in MongoDB driver 4.0+
    });

    // Log successful connection
    mongoose.connection.on("connected", () => console.log("Database Connected."));
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;