const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Add error catching wrapper
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post('/login', asyncHandler(authController.login));
router.post('/forgot-password', asyncHandler(authController.forgotPassword));
router.post('/verify-code', asyncHandler(authController.verifyCode));
router.post('/reset-password', asyncHandler(authController.resetPassword));

module.exports = router;