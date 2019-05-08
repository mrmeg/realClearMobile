const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const now = moment();
const uuid = require('uuid');
const id = uuid();

const HeadLineSchema = new mongoose.Schema({
  // _id: {type: String, required: true, default: uuid()},
  timestamp: {type: String, default: now.format("dddd, MMMM Do YYYY A")},
  headlines: {
    type: Object,
    id: {type: Schema.Types.ObjectId},
    stories: {type: Array},
    editorials: {type: Array}
  },
});

module.exports = mongoose.model('Headline', HeadLineSchema);