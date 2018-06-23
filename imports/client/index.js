import { Meteor } from 'meteor/meteor';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import CssBaseline from '@material-ui/core/CssBaseline';
import { render } from 'react-dom';
import Chat from './chat.js';
import Home from './home.js';

const AppRouter = props => {
  return (
    <div>
        <CssBaseline />
        <Router>
          <Switch>
            <Route exact path="/" component={Home} {...props} />
            <Route exact path="/chat/:_id" component={Chat} {...props} />
          </Switch>
        </Router>
    </div>
)};

const AppContainer = createContainer(() => {
  return {
  };
}, AppRouter);

render(<AppContainer />, document.getElementById('app'));
