const express = require('express');
const { handleCreateNewShortUrl, handleGetAnalytics } = require('../controllers/url');
const router = express.Router();

router.post('/', handleCreateNewShortUrl)
router.get('/analytics/:shortId', handleGetAnalytics)
module.exports = router;