const express = require('express');
const {User} = require('../../db/models')
const { Spot } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/current', requireAuth, async(req, res) => {
    const {}
})


module.exports = router;
