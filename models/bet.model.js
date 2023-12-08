const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define an array of valid sports types
const sportsEnum = ["sport", "casino"];

const BetHistorySchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  question: {
    type: String,
  },
  match_id: {
    type: String,
    required: true,
  },
  match_date: {
    type: String,
    required: true,
  },
  placed_at: {
    type: String,
    required: true,
  },
  event_name: {
    type: String,
    required: true,
  },
  event_type: {
    type: String,
    required: true,
  },

  league_id: {
    type: String,
    required: true,
  },
  league_name:{
 type:String,
  },
  match_name: {
    type: String, // Add the field for the match name
    required: true,
  },
  bet_type: {
    type: String,
    enum: ["back", "lay"],
    required: true,
  },
  stake: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["win", "lose", "refund", "pending"],
    default: "pending",
  },
  bet_category: {
    type: String,
    enum: ["fancy", "bookmaker", "odds", "toss"],
  },

  runner_name: {
    type: String,
  },
  event_type: {
    type: String,
    enum: sportsEnum,
    required: true,
  },

  updated_at: {
    type: String,
  },
});

// Create the BetHistory model
const BetModel = mongoose.model("bet", BetHistorySchema);
module.exports = { BetModel };
