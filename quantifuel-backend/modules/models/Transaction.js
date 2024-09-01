//------------------------------
//  AUTHOR: jone_santhanaraj
//------------------------------

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    utin: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    pump: { type: Schema.Types.ObjectId, ref: 'Pump', required: true },
    fuelStation: {
      type: Schema.Types.ObjectId,
      ref: 'FuelStation',
      required: true,
    },
    operator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel'],
      required: true,
    },
    fuelQuantityInLitre: { type: Number, required: true },
    pricePerLitre: { type: Number, required: true }, // in liters or rupees
    amountPaid: { type: Number, default: 0 }, // in rupees
    paymentMethod: {
      type: String,
      enum: ['UPI', 'wallet', 'cash', 'card'],
      default: null,
    },
    status: {
      type: String,
      enum: ['initiated', 'in-process', 'completed', 'cancelled'],
      default: 'initiated',
      required: true,
    },
    progress: { type: Number, default: 0 }, // in
    invoice: { type: String }, // URL or path to the e-invoice
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', TransactionSchema);
