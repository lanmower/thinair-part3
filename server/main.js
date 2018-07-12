import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import steem from 'steem';
const Posts = new Mongo.Collection('posts');
Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  "getPosts"(){
  }
});

Meteor.setInterval(()=>{
  var query = {
    limit: 10
  };
  steem.api.getDiscussionsByCreatedAsync(query).then(Meteor.bindEnvironment((response)=>{
    const permlinks = []
    for(x in response) {
      permlinks.push(response[x].permlink)
    }
    Posts.remove({permlink:{$nin:permlinks}});
    for(x in response) {
      if(!Posts.findOne({permlink:response[x].permlink})) Posts.insert(response[x]);
    }
  }));
},3000)
