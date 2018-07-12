import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import CssBaseline from '@material-ui/core/CssBaseline';
import { render } from 'react-dom';
window.Posts = new Mongo.Collection('posts');

const Index = props => {
  const {posts} = props;
  return (
    <div>
    <ul>
        {
          posts.map(
            (post) =>
            <li key={post.permlink}>
              {post.title}
            </li>
          )
        }
    </ul>
    </div>
  );
};

Meteor.call("getPosts");
const IndexContainer = createContainer(() => {
  const posts = Posts.find({}).fetch();
  console.log(posts);
  return {
    posts
  };
}, Index);

const AppRouter = props => {
  return (
    <div>
        <CssBaseline />
        <Router>
          <Switch>
            <Route exact path="/" component={IndexContainer} {...props} />
          </Switch>
        </Router>
    </div>
)};


render(<AppRouter />, document.getElementById('app'));
