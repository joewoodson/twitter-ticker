import React, { Component } from 'react'
import _ from 'lodash'
import Tweet from './tweet';

// declare var jQuery: jQuery;

const rootUrl = 'https://api.twitter.com/1.1/';
const proxyUrl = 'https://joe-p.herokuapp.com/';

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const mode = getParameterByName('mode');
const speed = !isNaN(getParameterByName('speed')) ? getParameterByName('speed') : '80';

class Ticker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: [],
      running: false,
      hideTweets: true,
      offline: false,
    };
  }

  componentDidMount(){
    const favorites = localStorage.getItem('tweets');
    if (favorites) {
      this.setState({ favorites: JSON.parse(favorites) });
    }
    //   this.setState({ favorites: JSON.parse(favorites) });
    //   if (!this.state.running) {
    //     this.setState({ running: true });
    //     this.initWebTicker();
    //   }
    //   return;
    // } else {
      this.fetchTweets();
    // }

    const intervalId = setInterval(this.fetchTweets.bind(this), 60000);
    // store intervalId in the state so it can be accessed later:
    this.setState({intervalId: intervalId});

    // set speed of ticker if query param is used
    this.refs.ticker.style.animationDuration = `${speed}s`;
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
      // this.initWebTicker();
      // this.setState({
      //   running: true,
      //   hideTweets: false,
      // });
    }
  }

  scroll(){

  }

  updateTweets(newFavorites){
    console.log('updating favorites list...');
    this.setState({ offline: false });
    // let newUnique = [];
    //
    // for (let t of diffFavorites) {
    //   if (_.some(newFavorites, { 'id_str': t.id_str })) {
    //     newUnique.push(t);
    //     _.remove(newFavorites, { 'id_str': t.id_str });
    //   }
    // }
    // if (newUnique.length > 0) {
    //   for (let t of newUnique) {
    //     newFavorites.push(t);
    //   }
    // }

    // use local storage tweets if newFavorites is empty for some reason
    if (!newFavorites && newFavorites.length() < 1) {
      let favorites = localStorage.getItem('tweets');
      if (favorites) {
        this.setState({ favorites: JSON.parse(favorites) });
      }
    }

    let oldFavorites = this.state.favorites;
    let updatedFavorites = _.intersectionBy(oldFavorites, newFavorites, 'id_str');

    // for (let t of oldFavorites.keys()) {
    //   if (!_.some(newFavorites, { 'id_str': t.id_str })) {
    //     oldFavorites.splice(t, 1);
    //   }
    // }

    // const removeOld = oldFavorites.map((t) => {
    //   return _.some(newFavorites, { 'id_str': t.id_str });
    // })

    for (let t of newFavorites) {
      if (!_.some(updatedFavorites, { 'id_str': t.id_str })) {
        updatedFavorites.push(t);
      }
    }

    localStorage.setItem('tweets', JSON.stringify(updatedFavorites));
    this.refs.ticker.addEventListener("webkitAnimationIteration", () => {
      this.setState({ favorites: updatedFavorites });
    });
    this.refs.ticker.addEventListener("animationiteration", () => {
      this.setState({ favorites: updatedFavorites });
    });
  }

  fetchTweets(){
    if (mode !== 'offline') {
      const request = new Request(`${proxyUrl}${rootUrl}favorites/list.json?&tweet_mode=extended&screen_name=joewdsn&count=10`, {
      	headers: new Headers({
      		Authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAAC7k2QAAAAAAUGifZBfJhkrz2xTH6o4f0F0KQcA%3DIqMxALOukBJv8V77TeGVsuGxwxlTKu3B1S8KUW3628TN3RrNSt'
      	})
      });

      fetch(request).then((response) => {
      	return response.json();
      }).then((j) => {
        if (!this.state.running) {
          this.setState({ running: true });
          // this.initWebTicker();
        }
        this.updateTweets(j.reverse());
      }).catch((err) => {
        this.setState({ offline: true });
        let favorites = localStorage.getItem('tweets');
        if (favorites) {
          this.setState({ favorites: JSON.parse(favorites) });
        }
        console.log('Error: ' + err);
        console.log('currently running in offline mode');
      });
    } else {
      console.log('currently running in offline mode');
    }

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
        <ul ref="ticker" className="tweets">
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
