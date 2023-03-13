const express = require('express');
const router = express.Router();
const { User, Spot, ReviewImage, Review, SpotImage, Booking } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');

//Delete a Review Image


module.exports = router;
