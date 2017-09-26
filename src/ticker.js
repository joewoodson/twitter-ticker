import React, { Component } from 'react'
import { connect } from 'react-refetch'

const rootUrl = 'https://api.twitter.com/1.1/';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

class Ticker extends Component {
  render() {
    const { favoritesFetch } = this.props

    if (favoritesFetch.pending) {
      // return <LoadingAnimation/>
      return <h3>Loading</h3>
    } else if (favoritesFetch.rejected) {
      console.log(favoritesFetch.reason)
      return <h3>Error</h3>
    } else if (favoritesFetch.fulfilled) {
      console.log(favoritesFetch.value);
      return <h3>{favoritesFetch.value.title}</h3>
    }

  }
}

export default connect(props => ({
  favoritesFetch: {
    url: `${proxyUrl}${rootUrl}favorites/list.json?count=10&screen_name=joewdsn`,
    headers: {
      Authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAAC7k2QAAAAAAUGifZBfJhkrz2xTH6o4f0F0KQcA%3DIqMxALOukBJv8V77TeGVsuGxwxlTKu3B1S8KUW3628TN3RrNSt'
    }
  }
}))(Ticker)
