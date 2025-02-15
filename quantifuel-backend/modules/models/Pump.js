//------------------------------
//  AUTHOR: jone_santhanaraj
//------------------------------

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PumpSchema = new Schema(
  {
    upin: { type: String, required: true, unique: true },
    ufsin: { type: String, required: true }, // Unique Fuel Station Identification Number
    pin: { type: String, required: true }, // QR Data
    qrUrl: { type: String }, // Unique Pump Identification Number
    fuelType: { type: String, required: true }, // e.g., 'Petrol', 'Diesel'
    status: {
      type: String,
      enum: ['available', 'in_use', 'maintenance'],
      default: 'available',
    },
    currentTransaction: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
      default: null,
    },
    fuelStation: {
      type: Schema.Types.ObjectId,
      ref: 'FuelStation',
      required: true,
    },
    operator: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pump', PumpSchema);
