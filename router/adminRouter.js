const express = require('express');
const router = express.Router();
const AdminController = require('../controller/admincontroller');
const upload =require("./../utils/storage")
const product = require('../controller/productcontroller')

router.post('/admin',upload.single('image'), AdminController.formPost);
router.get('/get-product',product.productget)
router.delete('/delete-product/:id',product.productDelete);
router.put('/update-product/:id',product.productEdit)
module.exports =  router ;
