import React, { Component } from 'react'
import ReactDOMServer from 'react-dom/server';
import { connect } from 'react-refetch'
import Tweet from './tweet';

declare var jQuery: jQuery;

const rootUrl = 'https://api.twitter.com/1.1/';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const speed = (getParameterByName('speed') && !isNaN(getParameterByName('speed'))) ? getParameterByName('speed') : 50;

class Ticker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: [],
      running: false,
      hideTweets: true,
    };
  }

  componentDidMount(){
    const favorites = localStorage.getItem('tweets');
    if (favorites) {
      this.setState({ favorites: JSON.parse(favorites) });
      if (!this.state.running) {
        this.setState({ running: true });
        this.initWebTicker();
      }
      return;
    } else {
      this.fetchTweets();
    }

    const intervalId = setInterval(this.fetchTweets.bind(this), 10000);
    // store intervalId in the state so it can be accessed later:
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount(){
     // use intervalId from the state to clear the interval
     clearInterval(this.state.intervalId);
  }

  componentDidUpdate(){
    // this.initWebTicker();
  }

  componentWillReceiveProps(){
    // this.initWebTicker();
    if (!this.state.running) {
      this.initWebTicker();
      this.setState({
        running: true,
        hideTweets: false,
      });
    }
  }

  initWebTicker(){
    jQuery(this.refs.webTicker).webTicker({
      speed: speed,
      height: "64px",
      hoverpause: false,
      // duplicate: true,
    });
  }

  fetchTweets(){
    const request = new Request(`${proxyUrl}${rootUrl}favorites/list.json?&tweet_mode=extended&screen_name=joewdsn&count=10`, {
    	headers: new Headers({
    		Authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAAC7k2QAAAAAAUGifZBfJhkrz2xTH6o4f0F0KQcA%3DIqMxALOukBJv8V77TeGVsuGxwxlTKu3B1S8KUW3628TN3RrNSt'
    	})
    });

    fetch(request).then((response) => {
    	return response.json();
    }).then((j) => {
      this.setState({ favorites: j });
      if (!this.state.running) {
        this.setState({ running: true });
        this.initWebTicker();
      }
    }).catch((err) => {
      console.log('Error: ' + err);
    });

  }

  render() {


    const favoritesList = this.state.favorites.map((favorite, i) => {

      // remove urls from Tweets that include media
      let text = favorite.full_text;
      if (favorite.entities.urls[0]) {
        text = text.replace(favorite.entities.urls[0].url, '');
      }

      if (favorite.extended_entities) {
        text= text.replace(favorite.extended_entities.media[0].url, '');
      }

      return <Tweet key={favorite.id_str} itemNum={i+1} text={text} author={favorite.user.screen_name} profileImage={favorite.user.profile_image_url} mediaUrl={favorite.entities.media ? favorite.entities.media[0].media_url_https : null} />
    });

    // return <ul id="webTicker" className={this.state.hideTweets ? "hidden" : ""} ref="webTicker">{favoritesList}</ul>
    return (
      <div className="marquee">
        <ul className="tweets">
          {favoritesList}
        </ul>
      </div>
    )

  }
}

// export default connect(props => ({
//   favoritesFetch: {
//     url: `${proxyUrl}${rootUrl}favorites/list.json?&tweet_mode=extended&screen_name=igbce&count=10`,
//     refreshInterval: 60000,
//     headers: {
//       Authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAAC7k2QAAAAAAUGifZBfJhkrz2xTH6o4f0F0KQcA%3DIqMxALOukBJv8V77TeGVsuGxwxlTKu3B1S8KUW3628TN3RrNSt'
//     },
//   }
// }))(Ticker)

export default Ticker;
