import React, { Component } from 'react';
import '../css/Tweet.css';

class Tweet extends Component {
  render() {
    return (
      <li data-update={`item${this.props.itemNum}`} className="tweet">
        <img src={this.props.profileImage} alt="user profile" /> <span className="author">@{this.props.author}:</span> <span className="text">{this.props.text}</span>
        { this.props.mediaUrl &&
          <img className="image-attached" src={this.props.mediaUrl} alt="attachment" />
        }
      </li>
    );
  }
}

export default Tweet;
