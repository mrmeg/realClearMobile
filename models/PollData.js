const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PollDataSchema = new mongoose.Schema({
  Poll: {type: String},
  Date: {type: String},
  Sample: {type: String},
  Approve: {type: Number},
  Disapprove: {type: Number},
  Spread: {type: String}
})

module.exports = mongoose.model('PollData', PollDataSchema, 'pollData');