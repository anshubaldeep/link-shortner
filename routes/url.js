const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');

const Url = require('../models/Url');

// @route     POST /api/url/shorten
// @desc      Create short URL
router.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  const baseUrl = config.get('baseUrl');

  // Check base url
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json('Invalid base url');
  }

  // Create url code
  const urlCode = shortid.generate();
  // Check long url
  if (validUrl.isUri(longUrl)) {
    try {
      const urlP = new URL(longUrl);
      //UTM Parameters like campaign can also be stored in our Mongo DB
      let campaign = urlP.searchParams.get('utm_campaign');
      let url = await Url.findOne({ longUrl });
      if (url) {
        res.json(url);
      } else {
        const shortUrl = baseUrl + '/' + urlCode;
        const {author} = req.body;
        const {noOfVisitsAllowed}=req.body;
        const noOfVisits=0;

        //If your UTM param like campaign is not given in URL it is defaulted to NewsBytes
        if(campaign==null){
          campaign='NewsBytes';
        }
        
        url = new Url({
          longUrl,
          shortUrl,
          urlCode,
          author,
          noOfVisitsAllowed,
          noOfVisits,
          campaign,
          date: new Date()
        });

        await url.save();

        res.json(url);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  } else {
    res.status(401).json('Invalid long url');
  }
});

module.exports = router;
