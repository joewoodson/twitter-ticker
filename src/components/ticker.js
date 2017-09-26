import React, { Component } from 'react'
import { connect } from 'react-refetch'
import Tweet from './tweet';

declare var jQuery: jQuery;

const rootUrl = 'https://api.twitter.com/1.1/';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

class Ticker extends Component {
  componentDidUpdate(){
    this.initWebTicker();
  }

  initWebTicker(){
    jQuery(this.refs.webTicker).webTicker({
      speed: 150,
      hoverpause: false,
    });
  }

  render() {
    const { favoritesFetch } = this.props

    // return (
    //   <ul id="webTicker" ref="webTicker">
 	 //    <li>This List Item will scroll infintely</li>
 	 //    <li>And this one will follow it</li>
 	 //    <li>Finally when it goes out of screen, it will queue again at the end</li>
    //   </ul>
    // );

    if (favoritesFetch.pending) {
      return <h3>Loading...</h3>
    } else if (favoritesFetch.rejected) {
      console.log(favoritesFetch.reason)
      return <h3>Error</h3>
    } else if (favoritesFetch.fulfilled) {
      const favorites = favoritesFetch.value.map((favorite) =>
        <Tweet key={favorite.id_str} text={favorite.text} />
      );

      return <ul id="webTicker" ref="webTicker">{favorites}</ul>

    }

  }
}

export default connect(props => ({
  favoritesFetch: {
    url: `${proxyUrl}${rootUrl}favorites/list.json?&screen_name=wizards_magic`,
    headers: {
      Authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAAC7k2QAAAAAAUGifZBfJhkrz2xTH6o4f0F0KQcA%3DIqMxALOukBJv8V77TeGVsuGxwxlTKu3B1S8KUW3628TN3RrNSt'
    },
  }
}))(Ticker)
