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

app.use(express.json());  // Use middleware to parse JSON request bodies

// Updated routes with proper path prefixes
app.use('/admin', AdminRouter);
// app.use('/user', UsrRouter);

app.listen(port, () => {
  console.log(`Server started and running on port ${port}`);
});
