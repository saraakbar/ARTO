require('dotenv').config()

const express = require('express')
const { default: mongoose } = require('mongoose')
const app = express()
const cors = require('cors');

mongoose.connect(process.env.DATABASE_URL, {})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(cors({origin: 'https://frontend-alpha-one-22.vercel.app/'}))
app.use(express.json())

const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');

app.use(userRoute);
app.use(productRoute);

app.listen(8000, () => console.log('Server Started'))