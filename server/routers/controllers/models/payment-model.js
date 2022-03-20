import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  CardNumber: { type: String, require: true },
  Cvv: { type: String, require: true },
  ExpDate: { type: String, require: true },
  Amount: { type: Number, require: true },
});

export default mongoose.model('PaymentModel', PaymentSchema);