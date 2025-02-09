const express = require('express');
const path =require("path")
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
require('dotenv').config();
const AdminRouter = require('./router/adminRouter');
const UsrRouter = require('./router/userRouter');
const NotificationRouter = require('./router/notification')


const port = process.env.PORT || 7000;
console.log(process.env.PORT)
const mongodbconnect = require('./config/db');
const { log } = require('console');
mongodbconnect();
app.use(cors({
  origin: 'http://localhost:5173',
    credentials: true, 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));
app.use('/public', express.static('public'));
app.use(express.json());  

app.use('/', AdminRouter);
app.use('/', UsrRouter);
app.use('/',NotificationRouter)

app.listen(port, () => {
  console.log(`Server started and running on port ${port}`);
});
