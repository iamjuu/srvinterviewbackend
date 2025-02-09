const express = require('express');
const router = express.Router();
const Notification = require('../controller/notification');
router.get('/notification', Notification.Notification);

module.exports = router;
