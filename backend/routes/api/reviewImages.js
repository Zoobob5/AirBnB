const express = require('express');
const router = express.Router();
const { User, Spot, ReviewImage, Review, SpotImage, Booking } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');

//Delete a Review Image
router.delete('/:imageId', requireAuth, async(req, res) => {
    const byeRevImg = await ReviewImage.findByPk(req.params.imageId);
    if (byeRevImg){
        await byeRevImg.destroy();
        return res.status(200).json({message: "Successfully deleted", statusCode: 200})
    }

    else {
        return res.status(404).json({message: "Review Image couldn't be found",statusCode:404});
    }




});

module.exports = router;
