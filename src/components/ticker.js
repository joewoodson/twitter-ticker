import React, { Component } from 'react'
import { connect } from 'react-refetch'
import Tweet from './tweet';

declare var jQuery: jQuery;

const rootUrl = 'https://api.twitter.com/1.1/';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const speed = (getParameterByName('speed') && !isNaN(getParameterByName('speed'))) ? getParameterByName('speed') : 50;

class Ticker extends Component {
  componentDidMount(){
    this.initWebTicker();
  }

  componentDidUpdate(){
    this.initWebTicker();
  }

  initWebTicker(){
    jQuery(this.refs.webTicker).webTicker({
      speed: speed,
      height: "64px",
      hoverpause: false,
    });
  }

  render() {
    const { favoritesFetch } = this.props

    if (favoritesFetch.pending) {
      // return <ul id="webTicker" ref="webTicker"><li className="loading-message">Loading...</li></ul>
      console.log('Loading...');
      return <span></span>
    } else if (favoritesFetch.rejected) {
      console.log(favoritesFetch.reason)
      return <h3 className="error-message">{favoritesFetch.reason.stack}</h3>
    } else if (favoritesFetch.fulfilled) {
      console.log(favoritesFetch.value);
      const favorites = favoritesFetch.value.map((favorite) =>
        <Tweet key={favorite.id_str} text={favorite.full_text} author={favorite.user.screen_name} profileImage={favorite.user.profile_image_url} />
      );

      return <ul id="webTicker" ref="webTicker">{favorites}</ul>

    }

  }
}

export default connect(props => ({
  favoritesFetch: {
    url: `${proxyUrl}${rootUrl}favorites/list.json?&tweet_mode=extended&screen_name=igbce`,
    headers: {
      Authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAAC7k2QAAAAAAUGifZBfJhkrz2xTH6o4f0F0KQcA%3DIqMxALOukBJv8V77TeGVsuGxwxlTKu3B1S8KUW3628TN3RrNSt'
    },
  }
}))(Ticker)
