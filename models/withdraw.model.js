const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const withdrawalGatewaySchema = new Schema({
  method: {
    type: String,
    required: true,
  },
  method_url:{
    type:String
    
  },
  method_id: {
    type: String || Number,
    required: true,
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
  withdraw_amount: {
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
  withdraw_slip: {
    type: String,
  },
  payable: {
    type: Number,
    required: true,
  },
  after_withdraw: {
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
    default: "withdraw",
  },
});

const WithdrawModel = mongoose.model("Withdrawal", withdrawalGatewaySchema);

module.exports = WithdrawModel;
