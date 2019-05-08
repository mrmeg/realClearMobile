const mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const Headline = require('../models/Headline');
const PollData = require('../models/PollData');
const LatestPoll = require('../models/LatestPoll');

module.exports = {

  getStories: () => {
    
    return new Promise((resolve, reject) => {

      Headline
        .find({})
        .sort()
        .then(stories => {
          // console.log(stories);
          resolve(stories);
        })
        .catch(err => {
          reject(err)
        })
    }); 
  },

  getRecentPolls: () => {
    
    return new Promise((resolve, reject) => {
      LatestPoll.find({})
        .then(data => {
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })

  },

  getPollData: () => {
  
    return new Promise((resolve, reject) => {
      PollData.find({})
        .then(data => {
        resolve(data)
      })
      .catch(err => {
        reject(err)
      })

    });

  },

};