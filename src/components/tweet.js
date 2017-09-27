import React, { Component } from 'react';
import '../css/Tweet.css';

class Tweet extends Component {
  render() {
    return (
      <li className="tweet"><span className="author">@{this.props.author}:</span> <span className="text">{this.props.text}</span></li>
    );
  }
}

export default Tweet;
