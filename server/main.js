import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import steem from 'steem';
const Posts = new Mongo.Collection('posts');
Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  "getPosts"(){
    Posts.remove({});
    var query = {
      tag: 'introduceyourself',
      limit: 10
    };
    steem.api.getDiscussionsByTrendingAsync(query).then(Meteor.bindEnvironment((response)=>{
    	for(x in response) {
    		Posts.insert(response[x]);
    	}
    }));
  }
});
