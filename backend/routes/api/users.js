// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

// ...
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// ...

const router = express.Router();

// backend/routes/api/users.js
// ...
const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid email'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('First Name is required'),
    handleValidationErrors
  ];

// backend/routes/api/users.js
// ...

// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { firstName, lastName, email, password, username } = req.body;
      const hasEmail = await User.findOne(
        {
          where: { email }
        }
      );


  if (hasEmail) {
    return res.status(403).json({
      message: 'User already exists',
      statusCode: 403,
      errors: {
        email: 'User with that email already exists',
      },
    });
  }

  else {
    const hasUser = await User.findOne(
      {
        where: { username }
      }

    );

    if (hasUser) {
      return res.status(403).json({
        message: 'User already exists',
        statusCode: 403,
        errors: {
          username: 'User with that username already exists',
        },
      });
    }

    else {
      const user = await User.signup({ firstName, lastName, email, username, password });
        await setTokenCookie(res, user);

      return res.json({ user: user });
    }
  }

    }
  );



module.exports = router;
