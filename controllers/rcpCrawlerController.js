const Headline = require('../models/Headline');
const Editorial = require('../models/Editorial');
const LatestPoll = require('../models/LatestPoll');
const mongoose = require('mongoose');
const $ = require('cheerio');
const cheerio = require('cheerio');
const uuid = require('uuid');

// Number of stories to download
var numStories = 17;
// Number of today's polls to download
var numPolls = 6;

module.exports = {

  getLatestPolls: (html) => {

    return new Promise((resolve, reject) => {

        polls = cheerioParsePolls(html);
        // console.log(polls);
        for(let i = 0; i < polls.length; i++) {
            let poll = polls[i];
            let margin = 0;
            let leader = 'Tie';
            if(poll.spread != 'Tie') {
                var str_split = poll.spread.split(' +');
                leader = str_split[0];
                margin = parseInt(str_split[1]);
            }
            let marginSplit = poll.spread.split(' +');
        }
        resolve(polls)
        // console.log('========================')

    function cheerioParsePolls(body) {
      let $ = cheerio.load(body);
      let polls = [];
      // let $table = $('#table-1').add($('#table-2').add($('#table-3')));
      let $tableOne = $('#table-1');
      let $races = $tableOne.find('tr:has(td.lp-race)');
    
      $races.map(function (index, el) {
          el = $(el)
    
          thisPoll = {
              race: el.find('td.lp-race a').text(),
              pollster: el.find('td.lp-poll a').text(),
              spread: el.find('td.lp-spread font span').text(),
              link: el.find('td.lp-poll a').attr('href'),
          };
    
          let results = el.find('td.lp-results a').text();
          let resultsObj = {};
          let candidates = results.split(', ');
          for (let i = 0; i < candidates.length; i++) {
              spr = candidates[i].split(' ');
              let margin = spr.pop();
              resultsObj[spr.join('')] = parseInt(margin);
          }
    
          thisPoll.results = resultsObj;
          polls[index] = thisPoll;
      });
      // console.log(polls)
      return polls;
    }
    })

  },

  getCurrentStories: (html) => {

    return new Promise((resolve, reject) => {
      let stories = {};
      let headlines = [];
      // 17 for morning update, 11 for afternoon
      for(let i = 0; i < numStories; i++) {
        // Links for stories
        let link = $('.list-view > .story > .post > .title > a', html)[i].attribs.href;
        // Titles for stories
        let title = $('.list-view > .story > .post > .title > a', html)[i].children[0].data;
        // Author and publication names
        let byline = $(`.byline`, html)[i].children[0].data;
        authorPub = byline.split(',');
        let author = authorPub[0];
        let publication = authorPub[1];
        
        let headline = { 
          id: uuid(),
          link: link,
          title: title,
          author: author,
          publication: publication
        };
        headlines.push(headline);
      } // end for loop
      stories.headlines = headlines;

      let editorials = [];
      for(let i = 0; i < 4; i++) {
        let link = $('.editorials > .post > .title > a', html)[i].attribs.href;
        let title = $('.editorials > .post > .title > a', html)[i].children[0].data;
        let publication = $('.editorials > .post > .byline', html)[i].children[0].data;

        let editorial = {
          id: uuid(),
          link: link,
          title: title,
          publication: publication
        }
        editorials.push(editorial);
      }
      stories.editorials = editorials
      // console.log(stories)
      resolve(stories)
    })
    .catch(err => {
      console.log(err)
      reject(err)
    })
  },

  saveLatestPolls: (polls) => {
    // console.log(polls)
    let todaysPolls = process.env.POLLS;

    for(let i = 0; i < todaysPolls; i++) {
      // console.log(polls[i])
      let latestPoll = new LatestPoll({
        race: polls[i].race,
        pollster: polls[i].pollster,
        spread: polls[i].spread,
        link: polls[i].link,
        results: polls[i].results
      })
      console.log(latestPoll);
      latestPoll.save((err) => {
        if (err) return console.error(err)
      })
    }
  },

  saveHeadlines: (stories) => {
    let headlines = new Headline({
      headlines: {stories: stories.headlines, editorials: stories.editorials}
    })
    console.log(headlines);
    headlines.save((err) => {
      if (err) return console.error(err)
      mongoose.disconnect();
    })
  },

};