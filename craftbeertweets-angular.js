/**
 * craftbeertweets-angular Meteor app
 *
 * v0.0.1
 */

Tweets = new Mongo.Collection("tweets");

if (Meteor.isClient) {
	angular.module("craftbeertweets", ['angular-meteor', 'angularMoment']);

	angular.module("craftbeertweets").controller("CraftBeerTweetsCtrl", ['$scope', '$window', '$meteor',
	function ( $scope, $window, $meteor ) {
    $scope.$meteorSubscribe("tweets");
    
    $scope.query = {};
    
    $scope.tweets = $meteor.collection(function() {
      // actually here just sort tweets by newest first
      return Tweets.find( $scope.getReactively('query'), { sort: { created_at: -1 } })
    });
    
    // a little moment.js fromNow formatting cleanup
    $window.moment.locale('en', {
      relativeTime : {
        future: 'in %s',
        past: '%s ago',
        s: '%ds',
        m: '1m',
        mm: '%dm',
        h: '1h',
        hh: '%dh',
        d: '1d',
        dd: '%dd',
        M: '1 month',
        MM: '%d months',
        y: '1 year',
        yy: '%d years'
      }
    });
	}]);
}
/*
 * general Meteor.methods for the client & server
 * but right now there aren't any
Meteor.methods({
  // ...
});
*/

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if ( Meteor.settings.hasOwnProperty('twit') === false ) {
      console.log( 'no Meteor.settings.twit found?!' );
    } else {
      Twit = new TwitMaker( Meteor.settings.twit );
      //  for example, twitter public stream track 'craftbeer'
      var stream = Twit.stream('statuses/filter', { track: 'craftbeer' })

      stream.on('tweet', Meteor.bindEnvironment( function(tweet) {
        var tw_url = 'twitter.com/'+ tweet.user.screen_name +'/status/'+ tweet.id_str;
        console.log( '** TWEET : '+ tw_url );
        var img = '';
        // check if tweet has media
        if ( tweet.entities.hasOwnProperty('media') ) {
          // if it does..
          if ( tweet.entities.media.length > 0 ) {
            // and if first media is a "photo"..
            if ( tweet.entities.media[0].type === 'photo' ) {
              // then save that https src
              img = tweet.entities.media[0].media_url_https;
            }
          }
        }
        /*
        var hashtags = [];
        // check for hashtags?
        if ( tweet.entities.hasOwnProperty('hashtags') ) {
          // if theyre there..
          if ( tweet.entities.hashtags.length > 0 ) {
            hashtags = tweet.entities.hashtags;
            console.log(hashtags);
            // like [{ text: 'craftbeer', indices: [ 51, 61 ] },...]
          }
        }
        */
            
        Tweets.insert({
          user_id: tweet.user.id_str,
          user_name: tweet.user.name,
          screen_name: tweet.user.screen_name,
          text: tweet.text,
          created_at: tweet.created_at,
          //hashtags: hashtags,
          img: img,
          origin_id: tweet.id_str,
          url: 'https://'+ tw_url
        });
      }));
    }
  });
  Meteor.publish("tweets", function () {
    return Tweets.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });
}
