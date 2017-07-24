require('dotenv').config();

var Twitter = require('twitter');
var express = require('express');
var nGrams = require('word-ngrams');
var app = express();

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var doChecks = (sorted, tweet) => {
  var checks = true;
  if (sorted.length > 9) checks = false;
  else if (tweet.includes('http')) checks = false;
  
  return checks;
};

var getTopTen = (count) => {
  var i = 1;
  var sorted = [];
  var keys = Object.keys(count).reverse();
  
  keys.forEach((key) => {
    var collection = count[key];
    collection.forEach((tweet) => {
      if (doChecks(sorted, tweet)) sorted.push(tweet);
    });
  });
  
  return sorted;
};
 
app.get('/search', function(req, res) {
  var params;
  // params = {screen_name: 'realdonaldtrump', count: 200};
  // client.get('statuses/user_timeline', params, function(error, tweets, response) {
  //   if (!error) {
  //     let content = tweets.map(t => t.text).join(' ');
  //     let grams = nGrams.buildNGrams(content, 3);
  //     let count = nGrams.listNGramsByCount(grams);
  //     let topTenUser = getTopTen(count);
  //     console.log('topTenUser', topTenUser);
  //   }
  // });
  
  params = {q: '@realdonaldtrump', count: 200};
  client.get('search/tweets', params, function(error, tweets, response) {
    if (!error) {
      res.send(tweets);
      // let content = tweets.map(t => t.text).join(' ');
      // let grams = nGrams.buildNGrams(content, 3);
      // let count = nGrams.listNGramsByCount(grams);
      // let topTenMentions = getTopTen(count);
      // console.log('topTenMentions', topTenMentions);
    }
  });
});



app.listen(3000);
