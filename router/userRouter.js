const express = require('express');
const router = express.Router();
const Signup = require('../controller/signupcontroller');
const Login = require('../controller/logincontroller');

// Ensure these controllers are properly defined and imported
router.post('/signup', Signup.signup);
router.post('/login', Login.login);

module.exports = router 
