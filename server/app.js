import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from 'config';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { paymentRouter } from './routers/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

const PORT = process.env.PORT || config.get('port');

app.use(express.json());
app.use(cors({
  credentials: true,
  origin: config.get('clientUrl'),
}));

app.use(express.static('../client/build'));

app.use('/api/payment', paymentRouter);

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/build', 'index.html')));

const start = async () => {
  try {
    await mongoose.connect(config.get('DB_URL'), { useUnifiedTopology: true, useNewUrlParser: true });
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

start();
