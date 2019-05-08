const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LatestPollSchema = new mongoose.Schema({
  race: {type: String},
  pollster: {type: String},
  spread: {type: String},
  link: {type: String},
  results: {
    type: Object,
    id: {type: Schema.Types.ObjectId},
  }
})

module.exports = mongoose.model('LatestPoll', LatestPollSchema);