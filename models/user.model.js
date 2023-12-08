const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    default: "",
  },
  user_id: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,
    default: "",
    // unique: true,
  },
  city: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  bank_name: {
    type: String,
    default: "",
  },
  bank_holder: {
    type: String,
    default: "",
  },
  account_number: {
    type: String,
    default: "",
  },
  ifsc_code: {
    type: String,
    default: "",
  },
  joined_at: {
    type: String,
    default: "",
  },
  updated_at: {
    type: String,
    default: "",
  },
  status: {
    type: Boolean,
    default: true,
  },
  state: {
    type: String,
    default: "",
  },
  bet_supported: {
    type: Boolean,
    default: true,
  },
  is_blocked: {
    type: Boolean,
    default: false,
  },
  kyc_verified: {
    type: Boolean,
    default: false,
  },
  sms_verified: {
    type: Boolean,
    default: false,
  },
  is_online: {
    type: Boolean,
    default: true,
  },
  last_seen: {
    type: String,
    default: "",
  },
  profile_picture: {
    type: String,
    default: "",
  },
  referral_code: {
    type: String,
    default: "",
  },
  refer_by: {
    type: String,
    default: "",
  },

  refer_by_code: {
    type: String,
    default: "",
  },

  referred_users: {
    type: Array,
    default: [],
  },

  amount: {
    type: Number,
    default: 0.0,
  },
  exposure_limit: {
    type: Number,
    default: 0,
  },
  max_limit: {
    type: Number,
    default: 1000, // Default maximum limit value, adjust as needed
  },
  min_limit: {
    type: Number,
    default: 100, // Default minimum limit value, adjust as needed
  },
  turnover: {
    type: Number,
    default: 0, // Default 0
  },
  bonus: {
    type: Number,
    default: 0, // Default 0
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
