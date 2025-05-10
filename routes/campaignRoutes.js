const express = require('express');
const router = express.Router();
const { createCampaign, getCampaigns, getAudienceSize } = require('../controllers/campaignController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/create-campaign',authenticate, createCampaign);
// router.post('/create-campaign', createCampaign);
router.get('/campaigns',authenticate, getCampaigns);
// router.get('/campaigns', getCampaigns);

router.post('/audience-size',authenticate,getAudienceSize);
// router.post('/audience-size',getAudienceSize);

module.exports = router;
