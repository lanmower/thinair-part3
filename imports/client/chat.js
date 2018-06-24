import React from 'react';
import steem from 'steem';
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var'; //https://docs.meteor.com/api/reactive-var.html
import Remarkable from 'remarkable';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import crypto from 'crypto';

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
        <Typography key={comment.permlink} style={{borderBottom: "solid", color: "#aab"}}>
          <b>@{comment.author}</b>:<span dangerouslySetInnerHTML={{ __html: rendered }}></span >
        </Typography>
      )
    }

    window.scrollTo(0,document.body.scrollHeight);
    return (
      <div>
        {
          (replies && replies.length) ?
          <div style={{color: "#aab", width:"800px", marginLeft:"auto", marginRight:"auto"}}>
            {
              replies.map(drawComment)
            }
            <CommentForm author={this.props.author} permlink={this.props.permlink}/>
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


class CommentForm extends React.Component {
  state = {
    comment: '',
  };
  handleChange = name => event => {
   this.setState({
     [name]: event.target.value,
   });
  }
  catchReturn(ev) {
    const self = this;
    console.log(`Pressed keyCode ${ev.key}`);
    if (ev.key === 'Enter' && !ev.shiftKey) {
      self.setState({post:''});
      steem.broadcast.comment('', this.props.author, this.props.permlink, '', crypto.createHash('md5').update(this.state.post).digest('hex'), '', this.state.post, {}, function(err, result) {
        console.log(err, result);
      });
      ev.preventDefault();
    }
  }
  render() {
    return <form noValidate autoComplete="off">
      <TextField
       style={{color: "#aab", width:"800px", marginLeft:"auto", marginRight:"auto"}}
       id="multiline-flexible"
       label="Post"
       multiline
       rowsMax="4"
       value={this.state.post}
       onChange={this.handleChange('post')}
       onKeyPress={(event) => { this.catchReturn(event) }}
       margin="normal"
     />
    </form>
  }
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { author, permlink } = this.props.match.params;
    const self = this;
    this.setState({repliesReactiveVar: new ReactiveVar(), contentReactiveVar: new ReactiveVar()});
    const update = ()=>{
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
    };
    Meteor.setTimeout(update,0);
    this.timeout = Meteor.setInterval(update,5000);
  }
  componentWillUnmount() {
    Meteor.clearInterval(this.timeout);
 }
  render () {
      return (
        <div>
          <ChatContainer author={this.props.match.params.author} permlink={this.props.match.params.permlink}  match={this.props.match} contentReactiveVar={this.state.contentReactiveVar} repliesReactiveVar={this.state.repliesReactiveVar}/>
        </div>
      )
  }
}

export default Page;
