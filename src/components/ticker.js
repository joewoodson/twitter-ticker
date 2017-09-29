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
      // this.fetchTweets();
    }

    // const intervalId = setInterval(this.fetchTweets.bind(this), 10000);
    // store intervalId in the state so it can be accessed later:
    // this.setState({intervalId: intervalId});
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

  updateTweets(updatedTweets){
    console.log(updatedTweets);
    this.updateWebTicker(updatedTweets);
  }

  updateWebTicker(favoritesList){
    console.log('updating');
    let favoritesHtml = '';
    const updatedFavoritesList = favoritesList.map((favorite, i) => {

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

    for (let i = 0; i < updatedFavoritesList.length; i++) {
      favoritesHtml += ReactDOMServer.renderToStaticMarkup(updatedFavoritesList[i]);
    }

    jQuery(this.refs.webTicker).webTicker('update',
        favoritesHtml,
        'swap',
        true,
        false
    );
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
      this.updateTweets(j);
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
          <li data-update="item1" className="tweet"><img src="http://pbs.twimg.com/profile_images/905479981459013637/a6BbKh4k_normal.jpg" alt="user profile"/> <span className="author">@nytimes:</span> <span className="text">The Interpreter: The unwritten rules for secession, and the contradictions among them </span></li>
          <li data-update="item2" className="tweet"><img src="http://pbs.twimg.com/profile_images/782474226020200448/zDo-gAo0_normal.jpg" alt="user profile"/> <span className="author">@elonmusk:</span> <span className="text">Fly to most places on Earth in under 30 mins and anywhere in under 60. Cost per seat should be… </span></li>
          <li data-update="item3" className="tweet"><img src="http://pbs.twimg.com/profile_images/905479981459013637/a6BbKh4k_normal.jpg" alt="user profile"/> <span className="author">@nytimes:</span> <span className="text">Myanmar abruptly cancelled a U.N. visit to the center of the Rohingya crisis, citing bad weather </span></li>
          <li data-update="item4" className="tweet"><img src="http://pbs.twimg.com/profile_images/905479981459013637/a6BbKh4k_normal.jpg" alt="user profile"/> <span className="author">@nytimes:</span> <span className="text">Facing arrest, Catalonia&#x27;s &quot;accidental&quot; leader says his region will vote Sunday on independence from Spain </span></li>
          <li data-update="item5" className="tweet"><img src="http://pbs.twimg.com/profile_images/671865418701606912/HECw8AzK_normal.jpg" alt="user profile"/> <span className="author">@SpaceX:</span> <span className="text">First opportunity to land BFR with cargo on Mars is 2022, followed by BFR crew and cargo missions to Mars in 2024. </span></li>
          <li data-update="item6" className="tweet"><img src="http://pbs.twimg.com/profile_images/877554927932891136/ZBEs235N_normal.jpg" alt="user profile"/> <span className="author">@Reuters:</span> <span className="text">FCC chair wants Apple to activate FM radio chips in iPhones  </span><img className="image-attached" src="https://pbs.twimg.com/media/DK0mBoLXcAASu9o.jpg" alt="attachment"/></li>
          <li data-update="item7" className="tweet"><img src="http://pbs.twimg.com/profile_images/903636921175252992/K9WYH-E2_normal.jpg" alt="user profile"/> <span className="author">@wizards_magic:</span> <span className="text">Who among you is excited for #MTGXLN’s release? Then, like Huatli, write a poem, and let your awesomeness increase! (On Sale September 29th) </span><img className="image-attached" src="https://pbs.twimg.com/media/DK0fI5FXkAA2G0-.png" alt="attachment"/></li>
          <li data-update="item8" className="tweet"><img src="http://pbs.twimg.com/profile_images/872153172256505857/CKtR_6lP_normal.jpg" alt="user profile"/> <span className="author">@shovan_ch:</span> <span className="text">Got my PR merged with @freeCodeCamp. Feeling great . Looking frward to contribute more #100DaysOfCode #CodeNewbie  </span><img className="image-attached" src="https://pbs.twimg.com/media/DKtcp24VwAEppKV.jpg" alt="attachment"/></li>
          <li data-update="item9" className="tweet"><img src="http://pbs.twimg.com/profile_images/861698928311271424/lqDIYF8B_normal.jpg" alt="user profile"/> <span className="author">@lupecamach0:</span> <span className="text">It&#x27;s official. I&#x27;m starting my very first #webdeveloper job mid-October. Thank you @freeCodeCamp and @TheOdinProject and @treehouse!</span></li>
          <li data-update="item10" className="tweet"><img src="http://pbs.twimg.com/profile_images/378800000147359764/54dc9a5c34e912f34db8662d53d16a39_normal.png" alt="user profile"/> <span className="author">@ossia:</span> <span className="text">The freeCodeCamp community YouTube channel won a Silver Play Button award from YouTube! Watch me unbox it. </span></li>
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
