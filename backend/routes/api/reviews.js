const express = require('express');
//const { User, Spot, ReviewImage, Review } = require('../../db/models');
const {User} = require('../../db/models')
const { Spot } = require('../../db/models');
const { check } = require('express-validator');
const {ReviewImage} = require('../../db/models');
const {Review} = require('../../db/models')
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');

const router = express.Router();

//Get all reviews curr user
router.get(
'/current',
 requireAuth,
 async(req, res) => {
  const curUser = req.user.id;

    let reviews = [];

    reviews = await Review.findAll({
      where: {userId: curUser},
        attributes: {
            includes:[
                'id',
                'userId',
                'spotId',
                'review',
                'stars',
                'createdAt',
                'updatedAt'
       ] },
        include: [
            {model: User},
            {model: Spot},
            {model: ReviewImage}
        ]
    });

    return res.status(200).json(reviews);
});

// add image
router.post('/:reviewId/images', async(req, res) => {
    const {reviewId} = req.params

    const currRev = await Review.findByPk(req.params.reviewId);

    if(!currRev){res.status(404);
      return res.json({message: "Review couldn't be found", statusCode: 404});
      }

    const {url, preview} = req.body;
    const img = await ReviewImage.create({reviewId:+reviewId, url, preview});

    const rObj = {
      id: img.id,
      url: img.url,
    };

    return res.status(201).json(rObj);
});

//edit review
router.put('/:reviewId',requireAuth, async(req, res) => {
    const reved = await Review.findByPk(req.params.reviewId);

   const {review, stars} = req.body;


   if (!reved) {
    return res.status(404).json({message: "Review couldn't be found", statusCode: 404 });
  }
  else{
    if(review)reved.review = review;
    if(stars)reved.stars = stars;


    await reved.save();
  }

   return res.status(200).json(reved)
  });

  //delete review
  router.delete('/:reviewId', async(req,res) => {
    const rev = await Review.findByPk(req.params.reviewId);

    if (!rev) {
      return res.status(404).json({message: "Review couldn't be found", statusCode: 404 });
    }
    else if(rev){
    await rev.destroy();
     return res.status(200).json({message: "Successfully deleted", statusCode: 200})
    }
  });


module.exports = router;
