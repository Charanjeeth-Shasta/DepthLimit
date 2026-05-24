const mongoose = require("mongoose");

const connectDB = async () => {
  const maxRetries = 5;
  const retryDelay = 3000; // 3 seconds
  let attempt = 1;

  const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB Connected");
      return true;
    } catch (error) {
      if (attempt < maxRetries) {
        console.log(`Database Connection Error: ${error.message}. Retrying in ${retryDelay / 1000}s (Attempt ${attempt}/${maxRetries})`);
        attempt++;
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return connect();
      } else {
        console.log("Database Connection Error: Max retries exceeded", error.message);
        process.exit(1);
      }
    }
  };

  return connect();
};

module.exports = connectDB;