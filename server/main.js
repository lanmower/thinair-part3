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

steem.api.streamOperations(Meteor.bindEnvironment((err, res) => {
  if (!res) return;
  const opType = res[0];
  const op = res[1];
  switch (opType) {
    case 'comment':
    handleComment(op);
    break;
    default:
    break;
  }
}));

function handleComment(data) {
    const { parent_author, parent_permlink, author } = data;
    console.log(data.title);
    if (parent_author == '') {
      Posts.insert(data);
    }
}
