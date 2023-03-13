const express = require('express');
const {User} = require('../../db/models')
const { Spot } = require('../../db/models');
const { SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { Review } = require('../../db/models');
const { ReviewImage } = require('../../db/models');
const { Booking } = require('../../db/models');
const { Sequelize, Op, Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../db/models');


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


      const spots = await Spot.findAll({
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
          "price",
          'createdAt',
          'updatedAt',
          ],
       include: [
        {
            model: Review,
            attributes: ['review', 'stars']
        },
        {
          model: SpotImage,
          attributes: ['preview']
        }
    ]
});

  res.json({ spots });

  });

  //Get all Spots owned by the Current User
  router.get(
    '/current',
    requireAuth,
    async (req, res) => {
      const curUser = req.user.id;

      const takenSpots = await Spot.findAll({
         where: {ownerId: curUser},

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
          "price",
          'createdAt',
          'updatedAt',
        ],
        include: [
            {
                model: Review,
                attributes: ['review', 'stars']
            },
            {
              model: SpotImage,
              attributes: ['preview']
            }
        ]
    });
    const sList = [];
    takenSpots.forEach(spots => {
        sList.push(spots.toJSON());
    });
    for await (let spot of sList) {

      delete spot.Reviews

      spot.SpotImages.forEach(images => {
          if (images.preview === true) {
              spot.previewImage = images.url
          }
      })

      if (!spot.previewImage) {
          spot.previewImage = 'N/A'
      }
      // avgRating
      const reviews = await Review.findAll({
          where: {
              spotId: spot.id
          }
      })
      let count = 0
      for await (let rev of reviews) {
          count += Number(rev.stars);
      }
      const avg = count / reviews.length;

      spot.avgRating = avg;
      if (!spot.avgRating) {
          spot.avgRating = 'N/A'
      }
      delete spot.SpotImages
  }
  res.json({
    Spots: sList
})
})
  //   for await(let spot of takenSpots) {
  //     const pImg = await SpotImage.findOne({
  //         where: {
  //             spotId: spot.id,
  //             preview: true
  //         }
  //     })

  //     if(pImg) {
  //         spot.dataValues.preview = pImg.url
  //     } else {
  //         spot.dataValues.preview = null;
  //     }

  //     const whole = await Review.findAll({
  //         where: {
  //             spotId: spot.id
  //         }
  //     })

  //     let sum = 0;

  //     if(whole.length) {
  //         whole.forEach(rates => {
  //             sum += rates.stars
  //         });

  //         let avg = sum / whole.length;
  //         console.log(spot.dataValues.avgRating)
  //         spot.dataValues.avgRating = avg;
  //     } else {
  //         spot.dataValues.avgRating = null;
  //     }
  // }


      // ]});

      let sum = [];
    //   for (let i = 0; i < takenSpots.length; i++) {
    //     const spot = takenSpots[i];

    //     const prevImg = await SpotImage.findOne({
    //         where: { spotId: spot.id, preview: true }
    //     });

    //     if (prevImg) {
    //         spot.dataValues.preview = prevImg.url;
    //     }

    //     const whole = await Review.findAll({
    //         where: { spotId: spot.id }
    //     });

    //     if (whole.length) {


    //         whole.forEach((rate, k) => {

    //           sum[k] = 0;
    //             sum[k] = sum[k] + rate.stars;

    //         });


    //     } else {
    //         spot.dataValues.avgRating = null;
    //     }
    //     let avg = sum[i] / 1

    //     spot.dataValues.avgRating = avg;


    // }
//, page, size
    // return res.json({spots: takenSpots});
    //  });

  router.get('/:spotId', async(req, res) => {
    const spotty = await Spot.findByPk(

      req.params.spotId,
      {include: [
        { model: User, attributes: ['id', 'firstName', 'lastName']},
        {model: SpotImage, attributes: ['id', 'url', 'preview']}
      ]}
    )
    console.log(spotty);
      if(!spotty){
        return res.status(404).json({
          message: "Spot couldn't be found",
          statusCode: 404
        })
      }
    return res.json(spotty)
  })

  router.post('/', requireAuth, validateSpots, async(req, res) => {
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    const place = await Spot.create({ownerId:req.user.id, address, city, state, country, lat, lng, name, description, price });

    return res.status(201).json(place);
  });

// add image
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
          where: {spotId: spotty.id},
          attributes: {
            include: [
            'userId',
            'spotId',
            'review',
            'stars'
            ]
        },
        include: [
            {model: User},
            {model: ReviewImage}
        ]


        });

        return res.status(200).json(reviews);
      }

      else{
        return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
      }


      });

      //create review for spotId
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
        
          if(reviewer) return res.status(403).json({ message: 'User already has a review for this spot', statusCode: 403 });

          return res.status(201).json({Booking: rev});
      });

//Get all Bookings for a Spot based on the Spot's id
      router.get(
        '/:spotId/bookings',
        requireAuth,
        async(req, res) => {

          let book = [];
          let spotty = await Spot.findByPk(req.params.spotId);


          if(!spotty){

              return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
            }

          if(spotty.ownerId === req.user.id){
            book = await Booking.findAll({
            where: {spotId: spotty.id},
            include: [
              {model: User,
              attributes:{},},
          ],
            attributes: {
              include: [
              'id',
              'spotId',
              'userId',
              'startDate',
              'endDate',
              'createdAt',
              'updatedAt'
              ]
          }

          });
          return res.status(200).json({Booking: book});
          }

          else{
            const book = await Booking.findAll({
              where: {spotId: spotty.id},
              attributes: ['spotId', 'startDate', 'endDate'],
            });
            return res.status(200).json({Booking: book});
          }



         } );

        // Create a Booking from a Spot based on the Spot's id
        router.post('/:spotId/bookings', requireAuth, async (req, res) => {
          const spotty = await Spot.findByPk(req.params.spotId);

          if (!spotty) {
            return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
          }

          const { startDate, endDate } = req.body;

          const existingBooking = await Booking.findOne({
            where: {
              userId: req.user.id,
              spotId: req.params.spotId,
              startDate: new Date(startDate),
              endDate: new Date(endDate)
            }
          });

          if (existingBooking) {
            const response = {
              message: "Sorry, this spot is already booked for the specified dates",
              statusCode: 403,
              errors: {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
              }
            };

            return res.status(403).json(response);
          }

          const booking = await Booking.create({
            userId: req.user.id,
            spotId: req.params.spotId,
            startDate: startDate,
            endDate: endDate
          });

          return res.status(201).json({ Booking: booking });
        });

module.exports = router;
