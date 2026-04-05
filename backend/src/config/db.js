const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://jeevanbm07_db_user:g0MP2dXfJMELfKxF@ac-eew2hqt-shard-00-00.wmxb3r0.mongodb.net:27017,ac-eew2hqt-shard-00-01.wmxb3r0.mongodb.net:27017,ac-eew2hqt-shard-00-02.wmxb3r0.mongodb.net:27017/ai-simulator?ssl=true&replicaSet=atlas-x14mjb-shard-0&authSource=admin&appName=Cluster0");

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;