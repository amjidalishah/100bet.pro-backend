const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionGatewaySchema = new Schema({
  method: {
    type: String,
    required: true,
  },
  method_id: {
    type: String || Number,
    required: true,
  },
  method_url:{
  type:String
  },
  transaction_id: {
    type: String,
    required: true,
    unique: true,
  },
  initiated_at: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  deposit_amount: {
    type: Number,
    required: true,
  },
  bonus: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["approved", "reject", "pending"],
    required:true,
    default: "pending",
  },
  updated_at: {
    type: String
  },
  deposit_slip: {
    type: String,
  },
  payable: {
    type: Number,
    required: true,
  },
  after_deposit: {
    type: Number,
    required: true,
  },
  wallet_amount: {
    type: Number,
    required: true,
  },
  admin_response: {
    type: String,
  },
  user_details: {
    type: Array,
  },
  admin_details: {
    type: Array,
  },
  utr_no: {
    type: String,
  },
  type: {
    type: String,
    default: "deposit",
  },
});

const DepositModel = mongoose.model("Deposit", transactionGatewaySchema);

module.exports = DepositModel;
