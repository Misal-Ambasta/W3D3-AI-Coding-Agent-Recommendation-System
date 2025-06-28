const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Recommendation endpoint
router.post('/recommend', apiController.recommendAgents);

// Get all agents
router.get('/agents', apiController.getAllAgents);

// Get agent by ID
router.get('/agents/:id', apiController.getAgentById);

// Analyze task
router.post('/analyze', apiController.analyzeTask);

module.exports = router; 