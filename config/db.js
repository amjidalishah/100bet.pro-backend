const mongoose = require("mongoose");
require("dotenv").config();

const connection = mongoose.connect(process.env.MONGO_URL, {
  // poolSize: 10, // Number of connections in the pool
  useNewUrlParser: true,
  useUnifiedTopology: true
});

connection
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

module.exports = { connection };
