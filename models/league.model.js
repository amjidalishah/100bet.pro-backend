const mongoose = require('mongoose');

// Define an enum for the allowed values


const leagueSchema = new mongoose.Schema({
  league_id: {
    type: String,
    required: true,
    unique:true
  },
  sport_id: {
    type: String,

  },
  name: {
    type: String,
    required: true,
  },
  market_count: {
    type: Number,
    
  },
  competition_region: {
    type: String,
    
  },
  status: {
    type: Boolean,
    default:false
  },
  created_at: {
    type:String
  },
  updated_at: {
    type: String,
  },
  league_logo: {
    type: String,
    default:""
  },
});

const LeagueModel = mongoose.model('league', leagueSchema);

module.exports = LeagueModel;
