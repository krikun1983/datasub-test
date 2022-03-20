import { PaymentModel } from '../models/index.js';

class PaymentService {
  async sendPayment(payment) {
    const sendPayment = await PaymentModel.create({ ...payment });
    await sendPayment.save();

    return { RequestId: sendPayment.id, Amount: sendPayment.Amount };
  }

  async getAllPayments() {
    const payments = await PaymentModel.find().sort({ "_id": -1 });

    return payments;
  }
};

export default new PaymentService();