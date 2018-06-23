import React from 'react';

import steem from 'steem';
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var'; //https://docs.meteor.com/api/reactive-var.html


class Chat extends React.Component {
  constructor(props) {
    super(props);
  }
  render(props) {
  const {lines} = props;
  return (
    <div>
        Hello World!
    </div>
)}
};

const ChatContainer = createContainer(() => {
  const lines = new ReactiveVar();
  return {
    lines
  };
}, Chat);

export default ChatContainer;
