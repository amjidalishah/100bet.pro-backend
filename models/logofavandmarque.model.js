const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logoAndFav = new Schema({
  logo: {
    type: String,
  },
  fav_icon: {
    type: String,
  },
  marque: {
    type: String,
  },
  fnq: {
    type: Array,
  },
  tc: {
    type: String,
  },
});

const LogoFav = mongoose.model("logoandfav", logoAndFav);

module.exports = LogoFav;
