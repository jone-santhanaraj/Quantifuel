const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FuelStationSchema = new Schema(
  {
    ufsin: { type: String, required: true, unique: true }, // Unique Fuel Station Identification Number
    name: { type: String, required: true },
    address: { type: String, required: true },
    operator: { type: Schema.Types.ObjectId, ref: 'User', required: false }, // The owner/operator of the fuel station
    pumps: [{ type: Schema.Types.ObjectId, ref: 'Pump' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('FuelStation', FuelStationSchema);
