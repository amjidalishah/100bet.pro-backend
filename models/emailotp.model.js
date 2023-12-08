const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define an array of valid sports types

const EmailOtpSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
});

// Create the BetHistory model
const EmailOtpModel = mongoose.model("emailotp", EmailOtpSchema);
module.exports = { EmailOtpModel };
