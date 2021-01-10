const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  urlCode: String,
  longUrl: String,
  shortUrl: String,
  author: String,
  noOfVisitsAllowed:Number,
  noOfVisits:Number,
  campaign: String,
  date: { type: String, default: Date.now }
});

module.exports = mongoose.model('Url', urlSchema);
