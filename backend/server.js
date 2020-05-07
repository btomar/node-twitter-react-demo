const express = require('express');
const http = require('http');
const router = express.Router();
const _ = require('lodash');
const Twitter = require('twitter');
const bodyParser = require('body-parser');
const cors = require('cors');
const server = http.createServer(app);
const socketIO = require('socket.io');
const socket = socketIO(server);
var twitterStream = '';
require('dotenv').config();

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var app = express();

// // enable cors
var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

router.get('/health-check', (req, res, next) => {
  res.status(200);
  res.send('Node Twitter Server is all Green!');
});

router.get('/timeline', (req, res, next) => {
  client.get('statuses/user_timeline.json', {'screen_name': req.query.screen_name},(error, tweets, response) => {
    if(error) {
      throw new Error(JSON.stringify(error));
    }
    if(tweets) {
      let tweetsResponse = [];
      tweets.forEach((tweet) => {
       tweetsResponse.push(tweet);
        
      });
      res.send(tweetsResponse);
    }
    
  });
});

router.get('/tweets', (req, res, next) => {
  client.get('search/tweets', {q: req.query.q},(error, tweets, response) => {
    if(error) {
      throw new Error(JSON.stringify(error));
    }
    if(_.get(tweets, 'statuses')) {
      let tweetsResponse = [];
      tweets.statuses.forEach((tweet) => {
       tweetsResponse.push(tweet);
        
      });
      res.send(tweetsResponse);
    }
    
  });
});


router.get('/statuses/home_timeline', (req, res, next) => {
  client.get('/statuses/home_timeline', (error, tweets, response) => {
    if(error) {
      throw new Error(JSON.stringify(error));
    }
    res.send(tweets);
  });
});

const startTwitterStream = (keyword) => {
  if (twitterStream == null) {
    console.log('Creating new Twitter stream.')
    twitterStream = client.stream('statuses/filter', { track: keyword })
    twitterStream.on('tweet', (tweet) => {
      socket.emit('newTweet', tweet)
    })
  } else {
    console.log('Stream already exists.')
  }
  socket.emit('searchTerm', keyword)
};

const stopTwitterStream = () => {
  console.log('Stopping Twitter stream.')
  twitterStream.stop()
  twitterStream = null
}


router.get('/statuses/filter', (req, res, next) => {
  var stream = client.stream('statuses/filter', {track: req.query.track});
  stream.on('data',(event) => {
    console.log(event && event.text);
    res.send(event);
  });
 
  stream.on('error',(error) => {
    throw new Error(JSON.stringify(error));
  });
});
app.use('/api/v1', router);
app.listen(3001);
module.exports = app;

console.log('Server running at http://localhost:3001/');