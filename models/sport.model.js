const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SportSchema = new Schema({
  sport_id: {
    type: String,
    enum: ["1", "2", "4"], // Allowed values for eventType
    required: true,
  },
  name: {
    type: String,
    enum:["tennis", "soccer", "cricket"],
    required: true,
  },
  market_count: {
    type: Number,
    required: true,
  },
  created_at: {
    type: String,
    
  },
  updated_at: {
    type: String,
    
  },
  status: {
    type: Boolean,
    default: false, // Default status is 'active'
  },
});


const SportModel = mongoose.model("sport", SportSchema);

module.exports = { SportModel };
