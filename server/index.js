const express = require('express');
const router = express.Router();

const score = require('./controllers/score/score.controller');

router.use('/score', score);

module.exports = router;