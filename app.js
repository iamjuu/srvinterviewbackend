// Import dependencies
const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 7000;
const mongodbconnect = require('./config/db')
mongodbconnect()

app.listen(port, () => {
  console.log(`Server started and running on port ${port}`);
});







