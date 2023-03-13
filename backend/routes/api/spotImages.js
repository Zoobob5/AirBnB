const express = require('express');
const router = express.Router();
const { User, Spot, ReviewImage, Review, SpotImage, Booking } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');

//Delete a Spot Image
router.delete('/:imageId', requireAuth, async(req, res) => {
    const byeSpotImg = await SpotImage.findByPk(req.params.imageId);

    if(!byeSpotImg) {
        return res.status(404).json({message: "Spot Image couldn't be found",statusCode:404});
    }

    else if (byeSpotImg){
        await byeSpotImg.destroy();
        return res.status(200).json({message: "Successfully deleted", statusCode: 200})
    }


});


module.exports = router;
