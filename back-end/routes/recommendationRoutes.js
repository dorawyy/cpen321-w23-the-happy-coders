const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController'); 

router.get('/:id', recommendationController.getRecommendedUsers); 

module.exports = router;
