const mongoose = require('mongoose');
const providerSchema = new mongoose.Schema({
  gpId: Number,
  gpName: String,
  gameId: Number,
  gameName: String,
  gameNameChinese: String,
  device: [String],
  status: {
    type: Boolean,
    default: true, // Default value for the status field (true or false)
  },
});

const CasinoProvider = mongoose.model('casinoprovider', providerSchema);

module.exports = CasinoProvider;
