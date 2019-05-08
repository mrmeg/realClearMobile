const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const now = moment();

const EditorialSchema = new mongoose.Schema({
  editorials: {type: Array},
  timestamp: {type: String, default: now.format("dddd, MMMM Do YYYY, h:mm:ss a")},
});

module.exports = mongoose.model('Editorial', EditorialSchema);