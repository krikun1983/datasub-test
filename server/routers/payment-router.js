import Router from 'express';
import { paymentController } from './controllers/index.js';

const paymentRouter = new Router();

paymentRouter.get('/', paymentController.getAllPayments);
paymentRouter.post('/send', paymentController.sendPayment);

export default paymentRouter;