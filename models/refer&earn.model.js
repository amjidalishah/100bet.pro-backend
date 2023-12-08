const mongoose = require("mongoose");

const referAndEarnSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  referal_code: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
  },
  last_loss_amount: {
    type: Number,
    default: 0,
  },
  total_referal_amount:{
    type: Number,
  }
});

const ReferAndEarn = mongoose.model(
  "referearn",
  referAndEarnSchema
);

module.exports = ReferAndEarn;
