const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const promotionSchema = new Schema({
  admin_id: {
    type: String,
    required: true,
  },
  full_name: {
    type: String,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    enum: ["sports", "casino"],
  },
  title: {
    type: String,
  },
  image_url: {
    type: String,
  },
  timestamp: {
    type: String,
  },
  open_date: {
    type: String,
  },
  end_date: {
    type: String,
  },
  rules:{
    type:String,
  },
  tc:{
    type:String,
  }
});

const PromotionModel = mongoose.model("promotion", promotionSchema);

module.exports = PromotionModel;
