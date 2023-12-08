const mongoose = require("mongoose");

const rulesRegulationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  currency_symbol: {
    type: String,
    required: true,
  },
  timezone: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  bet_max: {
    type: Number,
    required: true,
  },

  bet_min: {
    type: Number,
    required: true,
  },
  max_profit: {
    type: Number,
    required: true,
  },

  withdraw_max: {
    type: Number,
    required: true,
  },

  withdraw_min: {
    type: Number,
    required: true,
  },
  force_secure_password: {
    type: Boolean,
    default: true,
    required: true,
  },

  agree_policy: {
    type: Boolean,
    default: true,
    required: true,
  },

  user_resistration: {
    type: Boolean,
    default: true,
    required: true,
  },

  force_ssl: {
    type: Boolean,
    default: true,
    required: true,
  },

  email_verification: {
    type: Boolean,
    default: true,
    required: true,
  },
  email_notification: {
    type: Boolean,
    default: true,
    required: true,
  },

  sms_verification: {
    type: Boolean,
    default: true,
    required: true,
  },

  sms_notification: {
    type: Boolean,
    default: true,
    required: true,
  },

  strong_password: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const RulesRegulation = mongoose.model(
  "RulesRegulation",
  rulesRegulationSchema
);

module.exports = RulesRegulation;
