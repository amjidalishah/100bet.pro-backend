const mongoose = require("mongoose");

// Define an enum for the allowed values
const validStatusValues = [true, false];
const Schema = mongoose.Schema;
const matchSchema = new Schema({
  sport_id: {
    type: String, // Change the data type to string
    required: true,
  },
  match_id: {
    type: String, // Change the data type to string
    required: true,
    unique: true,
  },
  sport_name: {
    type: String,
    default: "",
  },
  league_id: {
    type: String, // Change the data type to string
    required: true,
  },
  match_name: {
    type: String, // Change the data type to string
    required: true,
  },

  league_name: {
    type: String, // Change the data type to string
    required: true,
  },
  odds: {
    type: Boolean,
    default: true,
    required: true,
  },
  bookmaker: {
    type: Boolean,
    default: true,
    required: true,
  },
  status: {
    type: Boolean,
    require: true,
    default: true,
  },
  fancy: {
    type: Boolean,
    required: true,
    default: true,
  },
  toss: {
    type: Boolean,
    required: true,
    default: true,
  },
  team: {
    type: String,
    default: "NA",
  },
  result: {
    type: String,
    enum: ["win", "lose", "refund", "pending"],
    default: "pending",
  },
  created_at: {
    type: String,
  },
  updated_at: {
    type: String,
  },
  open_date: {
    type: String,
  },
  country_code: {
    type: String,
  },
  undeclared_markets: {
    type: String,
  },
  first_team_logo: {
    type: String,
    default: "",
  },
  second_team_logo: {
    type: String,
    default: "",
  },
});

const MatchModel = mongoose.model("match", matchSchema);

module.exports = MatchModel;
