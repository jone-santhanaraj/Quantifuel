//------------------------------
//  AUTHOR: jone_santhanaraj
//------------------------------

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    uuin: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['customer', 'operator', 'admin'],
      default: 'customer',
    },
    preferences: {
      invoiceViaSMS: { type: Boolean, default: false },
      invoiceViaEmail: { type: Boolean, default: false },
      invoiceViaWhatsApp: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: ['active', 'in-transaction', 'off-duty', 'inactive'],
      default: 'active',
    },
    wallet: { type: Schema.Types.ObjectId, ref: 'Wallet', default: null },
    // Fields for admins
    fuelStation: [
      {
        objectId: {
          type: Schema.Types.ObjectId,
          ref: 'FuelStation',
          default: null,
        },
        ufsin: { type: String, default: null },
      },
    ],
    // Fields for operators
    assignedPump: {
      pumpId: { type: Schema.Types.ObjectId, ref: 'Pump', default: null },
      upin: { type: String, default: null },
    },
    fuelStationDetails: {
      fuelStationId: {
        type: Schema.Types.ObjectId,
        ref: 'FuelStation',
        default: null,
      },
      ufsin: { type: String, default: null },
      ownerId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
      ownerUuin: { type: String, default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
