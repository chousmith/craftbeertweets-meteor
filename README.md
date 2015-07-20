# craftbeertweets-meteor
Example of using Twitter Streaming API node.js twit with meteor.js via https://atmospherejs.com/mrt/twit > https://github.com/ttezel/twit to stream filter Tweets containing "craftbeer" :

`.stream('statuses/filter', { track: 'craftbeer' })`

Connects to Twitter's Streaming API, storing resulting tweets in a "Tweets" MongoDB collection, which then get published / sent to the client side.

View the example progress at http://craftbeertweets.meteor.com/

### tweet

tweet data is currently stored as

    Tweets.insert({
      user_id: tweet.user.id_str,
      user_name: tweet.user.name,
      screen_name: tweet.user.screen_name,
      text: tweet.text,
      created_at: tweet.created_at,
      img: img,
      origin_id: tweet.id_str,
      url: 'https://twitter.com/'+ tweet.user.screen_name +'/status/'+ tweet.id_str
    });

### hashtags

Not currently stored, but that could be nice? Hashtags do come in on the tweet.entities like

    var hashtags = [];
    if ( tweet.entities.hasOwnProperty('hashtags') ) {
      if ( tweet.entities.hashtags.length > 0 ) {
        hashtags = tweet.entities.hashtags;
        // like [{ text: 'craftbeer', indices: [ 51, 61 ] },...]
      }
    }

### moment.js

Oh also using moment via 

`meteor add jasonaibrahim:angular-moment`

and the a simple

    <small am-time-ago="tweet.created_at" ng-attr-title="{{tweet.created_at}}"></small>

which, like every other piece of this, could possibly be simplified and streamlined even a lot more than it already is?

## installation

First, you should copy the settings-example.json and replace the values with the keys from your Twitter app keys :

    {
      "twit": {
        "access_token": "youraccess_token",
        "access_token_secret": "youraccess_secret",
        "consumer_key": "yourconsumer_key",
        "consumer_secret": "yourconsumer_secret"
      }
    }

To run locally, after you have installed Meteor itself, download this someplace, cd to this root directory, copy the settings-example.json above to a settings.json using your actual Twitter app API keys, then

`meteor run --settings settings.json`

To view the local version once it is up and running, open http://localhost:3000 in a browser. Or whatever your computer's IP address is, go there on any other device on the network, at port 3000? Hmmm...

To push this to the clouds, like to craftbeertweets.meteor.com for example, you will need to specify that settings.json too like 

`meteor deploy craftbeertweets.meteor.com --settings settings.json`

ok well not that one because i think i already did

oh and if you are not wanting it any more there there you can 

`meteor deploy --delete whateveryournamewas.meteor.com`

## todos

in not much of any particular order

* make the directory structure better for future use?
* display the img below the text if there is an img
* display user images
* save the hashtags
* link the links
* save the location of the tweets if there was one provided
* do like twitter & rather than auto refreshing with the one at the top, update a counter with the unshown # until user chooses to show
* expire tweets after some time, too?
* better display (bootstrap?)
* log in with your own twitter & ability to do some things?
* google maps?!
* hashtag popularity charts?!?
* and then?

## changelog

### 0.1.3

* remove old meteor add account-password & account-ui since there is no account stuff at least not right now

### 0.1.2

* limit results to a max of the 10 most recent tweets from the server / db?

### 0.1.1

* more documentation and cleanup

### 0.1

* initial go
