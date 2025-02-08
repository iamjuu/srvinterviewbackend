const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const AdminRouter = require('./router/adminRouter');
const UsrRouter = require('./router/userRouter');
require('dotenv').config();

const port = process.env.PORT || 7000;
const mongodbconnect = require('./config/db');
mongodbconnect();
app.use(cors({
  origin: 'http://localhost:5173',
    credentials: true, 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));
app.use(express.json());  

app.use('/', AdminRouter);
app.use('/', UsrRouter);

app.listen(port, () => {
  console.log(`Server started and running on port ${port}`);
});
