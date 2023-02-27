const express = require('express');
const router = express.Router();
const { User, Spot, ReviewImage, Review, SpotImage, Booking } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');

//Get all booking curr user
// router.get(
//     '/current',
//      requireAuth,
//      async(req, res) => {
//         let books = []
//         books = await Booking.findAll({
//             attributes: [
//                 'id',
//                 'spotId',
//                 'userId',
//                 'startDate',
//                 'endDate'
//             ],
//             includes: [
//                 {model: Spot}
//             ]
//         });

//         return res.status(200).json(books);
//     });


module.exports = router;
