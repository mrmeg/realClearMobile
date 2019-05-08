const requestPromise = require('request-promise');
const $ = require('cheerio');
var cheerio = require('cheerio');
const url = 'https://www.realclearpolitics.com/';
const rcpCrawlerController = require('../controllers/rcpCrawlerController');
const pollUrl = 'https://www.realclearpolitics.com/epolls/latest_polls/';

var mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost:27017/mobile-news', { useNewUrlParser: true })
  .then(() => console.log('MONGODB CONNECTED'))
  .catch(err => console.log(err));
// console.log(mongoose.connection.readyState);

requestPromise(pollUrl)
  .then(html => {
    rcpCrawlerController.getLatestPolls(html)
      .then((polls) => {
        rcpCrawlerController.saveLatestPolls(polls);
      })
    .catch(err => {
      console.log(err);
    })
  })

// requestPromise(url)
//   .then(html => {
//     rcpCrawlerController.getCurrentStories(html)
//       .then((stories) => {
//         console.log(stories)
//         rcpCrawlerController.saveHeadlines(stories);
//       })
//   })
//   .catch((err) => console.log(err));