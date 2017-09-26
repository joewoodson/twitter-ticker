import React, { Component } from 'react';

class Tweet extends Component {
  render() {
    return (
      <h3>{this.props.text}</h3>
    );
  }
}

export default Tweet;
