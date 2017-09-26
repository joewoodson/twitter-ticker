import React, { Component } from 'react';

class Tweet extends Component {
  render() {
    return (
      <li>{this.props.text}</li>
    );
  }
}

export default Tweet;
