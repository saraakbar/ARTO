const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());
app.use(cors());
app.use(cors({
  origin: 'https://frontend-alpha-one-22.vercel.app',
}));

const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
app.use(userRoute);
app.use(productRoute);

app.listen(8000, () => console.log('Server Started'));
