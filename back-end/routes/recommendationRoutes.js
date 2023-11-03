const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController'); 

// Returns a list of recommended users
router.get('/:id', recommendationController.getRecommendedUsers); 

module.exports = router;
