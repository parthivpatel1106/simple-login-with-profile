const express = require("express");
const router = express.Router();
const authController = require('../controller/authControl')


router.post('/signup',authController.sign_up)
router.post('/login',authController.log_in)
router.post('/user',authController.user_profile)

module.exports=router