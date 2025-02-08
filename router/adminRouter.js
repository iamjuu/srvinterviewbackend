const express = require('express');
const router = express.Router();
const AdminController = require('../controller/admincontroller');

router.post('/', AdminController.formPost);

module.exports =  router ;
