import { paymentService } from './services/index.js';

class PaymentController {
  async sendPayment(req, res, next) {
    try {
      const payment = await paymentService.sendPayment(req.body);

      res.json(payment);
    } catch (error) {
      next(error);
    }
  }

  async getAllPayments(req, res, next) {
    try {
      const payment = await paymentService.getAllPayments();

      return res.json(payment);
    } catch (error) {
      next(error);
    }
  }
}

export default new PaymentController();