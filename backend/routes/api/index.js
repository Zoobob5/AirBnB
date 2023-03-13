const router = require('express').Router();
const { restoreUser } = require('../../utils/auth.js')
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js')
const spotImg = require('./spotImages.js')
const rev = require('./reviews.js')
const revImg = require('./reviewImages.js')
const book = require('./bookings.js')
// const { requireAuth } = require('../../utils/auth.js');
// const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');

// GET /api/restore-user
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);

router.use('/spot-images', spotImg);

router.use('/reviews', rev);

router.use('/bookings', book);

router.use('/review-images', revImg);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});


module.exports = router;
