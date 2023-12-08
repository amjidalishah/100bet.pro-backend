const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define a Mongoose schema
const casinoSchema = new Schema({
  Username: { type: String,required: true },
  ProductType: { type: String, required: true },
  GameType: { type: String, required: true },
  Amount: { type: Number, required: true },
  TransferCode: { type: String, required: true },
  TransactionId: { type: String, required: true},
  Status: {
    type: String,
    enum: ["settled", "void", "running"],
    required: true,
    default: "running",
  },
  BetTime: { type: String },
  GameId: { type: String, default: "" }, // Optional field
  GamePeriodId: { type: String, default: null },
  OrderDetails: { type: String, default: null },
  GameTypeName: { type: String, default: null },
  GpId: { type: Number }, // Optional field
  GameRoundId: { type: String }, // Optional field
  WinLoss: { type: String,  default: 0 },
  ResultTime: { type: String, default: "" },
  GameResult: { type: String, default: "" },
  CommissionStake: { type: Number, default: 0.0 },
  ResultType: { type: Number, enum: [0, 1, 2] },
  ReturnStake :{ type: Number, default:0},
  EventType:{type:String, default:"casino"},
  UserId:{type:String},
  ExtraInfo: {
    SportType: { type: String, default: "" },
    MarketType: { type: String, default: "" },
    League: { type: String, default: "" },
    Match: { type: String, default: "" },
    BetOption: { type: String, default: "" },
    KickOffTime: { type: String, default: "" },
  }, // Optional nested object
});

// Create a Mongoose model using the schema
const CasinoModel = mongoose.model("Casino", casinoSchema);

module.exports = CasinoModel;
