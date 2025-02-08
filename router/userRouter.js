const express = require('express');
const router = express.Router();
const Signup = require('../controller/signupcontroller');
const Login = require('../controller/logincontroller');
const Subcribe = require('../controller/subsribecontroller')
  const handleSubscribe = (productId) => {
    setSubscriptions(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

// Ensure these controllers are properly defined and imported
router.post('/signup', Signup.signup);
router.post('/login', Login.login);
router.post('/subscribe',Subcribe.Subscribe)

module.exports = router 
