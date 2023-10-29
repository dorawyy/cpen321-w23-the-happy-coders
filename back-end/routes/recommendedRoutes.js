const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController'); 

router.post('', recommendationController.getRecommendedUsers); 

module.exports = router;
