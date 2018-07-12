import { Meteor } from 'meteor/meteor';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import CssBaseline from '@material-ui/core/CssBaseline';
import { render } from 'react-dom';

const Index = props => {
  return (
    <div>
        Hello World!
    </div>
)};


const AppRouter = props => {
  return (
    <div>
        <CssBaseline />
        <Router>
          <Switch>
            <Route exact path="/" component={Index} {...props} />
          </Switch>
        </Router>
    </div>
)};

const AppContainer = createContainer(() => {
  return {
  };
}, AppRouter);

render(<AppContainer />, document.getElementById('app'));
