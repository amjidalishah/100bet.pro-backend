const mongoose = require("mongoose");

// Define an array of valid sports types
const Schema = mongoose.Schema;

const ControlSchema = new Schema({
  control_id: {
    type: String,
    required: true,
  },
  bet_supported: {
    type: Boolean,
    required: true,
    default:true
  },
  deposit_blocked: {
    type: Boolean,
    required: true,
    default:true
  },
  withdraw_blocked: {
    type: Boolean,
    required: true,
    default:true
  },
  sport_bet_suspended: {
    type: Boolean,
    required: true,
    default:true
  },

  casino_bet_suspended: {
    type: Boolean,
    required: true,
    default:true
  },
  user_resister: {
    type: Boolean,
    required: true,
    default:true
  },
   receve_mail_weekly: {
    type: Boolean,
    required: true,
    default:true
  },

});

// Create the BetHistory model
const ControlModel = mongoose.model("Control", ControlSchema);
module.exports = { ControlModel };
