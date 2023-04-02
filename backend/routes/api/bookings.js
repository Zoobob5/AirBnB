const express = require('express');
const router = express.Router();
const { User, Spot, ReviewImage, Review, SpotImage, Booking } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');

//Get all booking curr user
router.get(
    '/current',
     requireAuth,
     async(req, res) => {
        const curUser = req.user.id;
        let books = []
        books = await Booking.findAll({
            where: {userId: curUser},
            attributes: [
                'id',
                'spotId',
                'userId',
                'startDate',
                'endDate',
                "createdAt",
                "updatedAt"
            ],
            include: [
            {model: Spot,
                attributes: {
                    exclude: [
                        "description",
                        "createdAt",
                        "updatedAt"
                        ]
                      }}
            ]
        });

        return res.status(200).json({Bookings:books});
    });

    //Edit a Booking

    router.put('/:bookingId', requireAuth, async(req, res) => {
        const curUser = req.user.id;
        const booked = await Booking.findByPk(req.params.bookingId);

        const {startDate, endDate} = req.body;

        if (!booked) {
            return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
        }
        else{
            booked.startDate = startDate;
            booked.endDate = endDate;

        await booked.save();

        }

        return res.status(200).json(booked)
      });

      //delete review
  router.delete('/:bookingId', async(req,res) => {
    const book = await Booking.findByPk(req.params.bookingId);

    if (!book) {
      return res.status(404).json({message: "Booking couldn't be found", statusCode: 404 });
    }
    else if(book){
    await book.destroy();
     return res.status(200).json({message: "Successfully deleted", statusCode: 200});
    }
  });


module.exports = router;
