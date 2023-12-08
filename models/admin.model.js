const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  admin_id: {
    type: String,
    required: true,
    default:"1"
  },
  full_name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  facebook: {
    type: String,
  },
  twitter: {
    type: String,
  },
  instagram: {
    type: String,
  },
  city: {
    type: String,
  },
  amount: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    default: true,
    
  },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;