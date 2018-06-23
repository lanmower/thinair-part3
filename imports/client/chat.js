import React from 'react';
import steem from 'steem';
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var'; //https://docs.meteor.com/api/reactive-var.html
import Remarkable from 'remarkable';

const remarkable = new Remarkable({
    html: true, // remarkable renders first then sanitize runs...
    breaks: true,
    linkify: false, // linkify is done locally
    typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
    quotes: '“”‘’',
});


class Chat extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {replies} = this.props;
    const drawComment = (comment)=>
    {
      const rendered = remarkable.render(comment.body);
      return (
        <div key={comment.permlink} style={{width:"800px", marginLeft:"auto", marginRight:"auto"}}>
          <b>{comment.author}</b>:<span dangerouslySetInnerHTML={{ __html: rendered }}></span >
        </div>
      )
    }

    return (
      <div>
        {
          (replies && replies.length) ?
          <div>
            {
              replies.map(drawComment)
            }
          </div>
          :
          <div>
              No replies found.
          </div>
        }
      </div>
    )
  }
}


const ChatContainer = createContainer (
  ({match, repliesReactiveVar, contentReactiveVar}) => {
    let content, replies;
    if(contentReactiveVar) content = contentReactiveVar.get();
    if(repliesReactiveVar) replies = repliesReactiveVar.get();
    return { content, replies }
  }
, Chat);

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { author, permlink } = this.props.match.params;
    const self = this;
    this.setState({repliesReactiveVar: new ReactiveVar(), contentReactiveVar: new ReactiveVar()});
    this.timeout = Meteor.setInterval(()=>{
      console.log("update", author, permlink);
      const content = self.state.contentReactiveVar.get();
      const replies = self.state.repliesReactiveVar.get();
      if(author && permlink) {
        steem.api.getContentRepliesAsync(author, permlink).then(function(replies) {
          console.log("update");
          self.state.repliesReactiveVar.set(replies);
        });
        if(!content || author != content.author) {
          steem.api.getContentAsync(author, permlink).then(function(post) {
            self.state.contentReactiveVar.set(post)
          });
        }
      }
    },5000);
  }
  componentWillUnmount() {
    Meteor.clearInterval(this.timeout);
 }
  render () {
      return <ChatContainer match={this.props.match} contentReactiveVar={this.state.contentReactiveVar} repliesReactiveVar={this.state.repliesReactiveVar}/>
  }
}

export default Page;
