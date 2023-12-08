const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  currency: {
    type: String,
    required: true,
  },
  processing_time: {
    type: String,
    required: true,
    default: "10 minute's",
  },

  bonus: {
    type: Number,
    bonus: 0,
  },
  gateway: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
  image: {
    type: String,
    require: false,
  },
  max_limit: {
    type: Number,
    require: true,
  },
  min_limit: {
    type: Number,
    required: true,
  },
  instruction: {
    type: String,
    require: false,
  },
  admin_details: [],
  user_details: [],
  type: {
    type: String,
    require: true,
    enum: ["deposit", "withdraw"],
  },
});

const PaymentModel = mongoose.model("payment", PaymentSchema);

module.exports = { PaymentModel };
