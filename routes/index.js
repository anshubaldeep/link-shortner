const express = require('express');
const router = express.Router();

const Url = require('../models/Url');

// @route     GET /:code
// @desc      Redirect to long/original URL
router.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });

    if (url) {
      if(url.noOfVisits<url.noOfVisitsAllowed){
        url.noOfVisits++;
        await url.save();
        return res.redirect(url.longUrl);
      }
      else{
        return res.status(403).json('No of visits exceeded');
      }
    } else {
      return res.status(404).json('No url found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

module.exports = router;
