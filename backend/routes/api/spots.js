const express = require('express');
const {User} = require('../../db/models')
const { Spot } = require('../../db/models');
const { SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { Review } = require('../../db/models');
const { ReviewImage } = require('../../db/models');


const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const router = express.Router();

const validateSpots = [
  check('address')
    .exists({checkFalsy: true})
    .withMessage('Street address is required'),
  check('city')
    .exists({checkFalsy: true})
    .isString()
    .withMessage('City is required'),
  check('state')
    .exists({checkFalsy: true})
    .isString()
    .withMessage('State is required'),
  check('country')
    .exists({checkFalsy: true})
    .isString()
    .withMessage('Country is required'),
  check('lat')
    .exists({checkFalsy: true})
    .isDecimal()
    .withMessage('Latitude is not valid'),
  check('lng')
    .exists({checkFalsy: true})
    .isDecimal()
    .withMessage('Longitude is not valid'),
  check('name')
    .exists({checkFalsy: true})
    .isString()
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({checkFalsy: true})
    .isString()
    .withMessage('Description is required'),
  check('price')
    .exists({checkFalsy: true})
    .isNumeric()
    .withMessage('Price per day is required'),
  handleValidationErrors
];

const validateReview = [
check('review')
    .exists({checkFalsy: true})
    .isString()
    .withMessage('Review text is required'),
  check('stars')
    .exists({checkFalsy: true})
    .isDecimal()
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
]

// GETTING all spots
router.get(
    '/',
    async (req, res) => {

      let spots = []
      spots = await Spot.findAll({
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "description",
          "price"
      ]});
      return res.json(spots);


  });

  //Get all Spots owned by the Current User
  router.get(
    '/current',
    requireAuth,
    async (req, res) => {
      let spots = []
      spots = await Spot.findAll({
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "description",
          "price"
      ]});
      return res.json(spots);
    });

  router.get('/:spotId', async(req, res) => {
    const spotty = await Spot.findByPk(

      req.params.spotId,
      {includes: [
        { model: User},
        {model: SpotImage}
      ]}
    )
      if(!spotty){
        return res.status(404).json({
          moessage: "Spot couldn't be found",
          statusCode: 404
        })
      }
    return res.json(spotty)
  })

  router.post('/', requireAuth, validateSpots, async(req, res) => {
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    const place = await Spot.create({address, city, state, country, lat, lng, name, description, price, ownerId:req.user.id});

    return res.status(201).json(place);
  });


  router.post('/:spotId/images', async(req, res) => {
    const {spotId} = req.params

    const currSpot = await Spot.findByPk(req.params.spotId);

    if(!currSpot){res.status(404);
      return res.json({message: "Spot couldn't be found", statusCode: 404});
      }

    const {url, preview} = req.body;
    const img = await SpotImage.create({spotId:+spotId, url, preview});

    const rObj = {
      id: img.id,
      url: img.url,
      preview: img.preview
    };



    return res.status(201).json(rObj);
  });

  router.put('/:spotId',requireAuth, async(req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);

   const {address, city, state, country, lat, lng, name, description, price} = req.body;


   if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
  }
  else{
    if(address)spot.address = address;
    if(city)spot.city = city;
    if(state)spot.state = state;
    if(country)spot.country = country;
    if(lat)spot.lat = lat;
    if(lng)spot.lng = lng;
    if(name)spot.name = name;
    if(description)spot.description = description;
    if(price)spot.price = price;

    await spot.save();
  }

   return res.status(200).json(spot)
  });

    router.delete('/:spotId', async(req,res) => {
      const spot = await Spot.findByPk(req.params.spotId);

      if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
      }
      else if(spot){
      await spot.destroy();
       return res.status(200).json({message: "Successfully deleted"})
      }
    })

    router.get(
      '/:spotId/reviews',
      async(req, res) => {
        let reviews = [];
        let spotty = await Spot.findByPk(req.params.spotId);

        if(spotty){
        reviews = await Review.findAll({
          attributes: {
            include: [
            'userId',
            'spotId',
            'review',
            'stars'
            ]
        },
        includes: [
            {model: User},
            {model: ReviewImage}
        ]
        });
      }

      else{
        return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
      }

        return res.status(200).json(reviews);

      });

      //Get all reviews by spot id
      router.post('/:spotId/reviews', requireAuth, validateReview, async(req, res) => {
        let spotty = await Spot.findByPk(req.params.spotId);

        if(!spotty){
          return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
        }


        let reviewer = await Review.findOne({where: {userId: req.user.id, spotId: req.params.spotId,}});
        const {review, stars} = req.body;
          const rev = await Review.create({
            review,
            stars,
            userId: req.user.id,
            spotId: req.params.spotId,
          });

          if(reviewer)return res.status(403).json({ message: 'User already has a review for this spot', statusCode: 403 });
          return res.status(200).json(rev);
      });


module.exports = router;
