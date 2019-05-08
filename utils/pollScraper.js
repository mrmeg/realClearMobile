const requestPromise = require('request-promise');
const $ = require('cheerio');
var cheerio = require('cheerio');
const url = 'http://www.realclearpolitics.com/epolls/latest_polls/#';

var mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost:27017/mobile-news', { useNewUrlParser: true })
  .then(() => console.log('MONGODB CONNECTED'))
  .catch(err => console.log(err));

function pollIdGen(poll) {
  function isUpperCase(aCharacter)
  {
      return (aCharacter >= 'A') && (aCharacter <= 'Z');
  }

  function abbrevGen(sentence) {
      var abbrev = '';
      for (var i = 0, len = str.length; i < len; i++) {

      }
  }
}

onWakeup();

function onWakeup() {
  //Pull down polls page
  requestPromise(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          polls = cheerioParsePolls(body);
          // console.log(polls);
          for(var i = 0; i < polls.length; i++) {
              var poll = polls[i];
              var margin = 0;
              var leader = 'Tie';
              if(poll.spread != 'Tie') {
                  var str_split = poll.spread.split(' +');
                  leader = str_split[0];
                  margin = parseInt(str_split[1]);
              }
              var marginSplit = poll.spread.split(' +');
          }
          console.log('========================')
      } else {
          console.log(error.message);
      }
  });
}

function cheerioParsePolls(body) {
  var $ = cheerio.load(body);
  var polls = [];
  var $table = $('#table-1').add($('#table-2').add($('#table-3')));
  var $tableOne = $('#table-1');
  var $races = $table.find('tr:has(td.lp-race)');
  var year = new Date().getFullYear();

  $races.map(function (index, el) {
      el = $(el)

      thisPoll = {
          race: el.find('td.lp-race a').text(),
          pollster: el.find('td.lp-poll a').text(),
          spread: el.find('td.lp-spread font span').text(),
          link: el.find('td.lp-poll a').attr('href'),
      };

      var results = el.find('td.lp-results a').text();
      var resultsObj = {};
      var candidates = results.split(', ');
      for (var i = 0; i < candidates.length; i++) {
          spr = candidates[i].split(' ');
          var margin = spr.pop();
          resultsObj[spr.join('')] = parseInt(margin);
      }

      thisPoll.results = resultsObj;
      polls[index] = thisPoll;
  });
  console.log(polls)
  return polls;
}

mongoose.disconnect();