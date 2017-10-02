import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import Tweet from './tweet';

declare var jQuery: jQuery;

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
const speed = (getParameterByName('speed') && !isNaN(getParameterByName('speed'))) ? getParameterByName('speed') : 80;

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
    } else {
      this.fetchTweets();
    }
    //   this.setState({ favorites: JSON.parse(favorites) });
    //   if (!this.state.running) {
    //     this.setState({ running: true });
    //     this.initWebTicker();
    //   }
    //   return;
    // } else {
      // this.fetchTweets();
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
    // console.log(this.refs.tweet903266364915376128);
    if (!this.state.running) {
      this.handleTicker();
      this.setState({ running: true });
    }
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

  handleTickerClones(){
    console.log('handleClones');
    var $line = jQuery(this.refs.ticker);
    var lineWidth = 1;
    $line.children("li.tick-clones").remove();
    var $tickercontainer = $line.parent();
    var elements = $line.children("li");
    var fill = function(){
			lineWidth = 1;
			$line.append(elements.clone(true).addClass("tick-clones"));
			$line.children("li").each(function (i) {
				lineWidth += jQuery(this, i).outerWidth(true);
				//outherWidth con argomento true ritorna larghezza compresi margini
			});

		}
    var l = $tickercontainer.outerWidth(true);
		while(lineWidth<l) fill();
  }

  handleTicker(){
    if (this.state.favorites.length > 1 && !this.state.running) {
      this.setState({ running: true });

      console.log('handleTicker');
      var j = jQuery;
          var $line = j(this.refs.ticker);
          var id = "ER_"+ new Date().getTime();
          $line.wrap("<div id=\""+id+"\"></div>");
  		$line.css({
  			margin: "0 !important",
  			padding: "0 !important"
  		});
          var currentSpazio,currentTempo;
          var run = true;
          var initialOffset = $line.offset().left;
  		var lineWidth = 1;
          $line.children("li.tick-clones").remove();
  		//elimina cloni se ci sono - Serve in caso io aggiorni dinamicamente il contenuto
          $line.addClass("newsticker");
          var $mask = $line.wrap("<div class='mask'></div>");
          var $tickercontainer = $line.parent().wrap("<div class='tickercontainer'></div>");
  		var elements = $line.children("li");
  		var fill = function(){
  			lineWidth = 1;
  			$line.append(elements.clone(true).addClass("tick-clones"));
  			$line.children("li").each(function (i) {
  				lineWidth += j(this, i).outerWidth(true);
  				//outherWidth con argomento true ritorna larghezza compresi margini
  			});

  		}
  		var l = $tickercontainer.outerWidth(true);
  		while(lineWidth<l) fill();
  		$line.width(lineWidth);
          $line.height($line.parent().height());
          function scrollnews(spazio, tempo) {
              $line.animate({left: '-=' + spazio}, tempo, "linear", function () {
                  $line.children("li:first").appendTo($line);
                  $line.css("left", 0);
                  currentSpazio = $line.children("li:first").outerWidth(true);
                  currentTempo = tempo / spazio * currentSpazio;
                  if(run)
                  	scrollnews(currentSpazio, currentTempo);
              });
          }
          //BOOT
          currentSpazio = $line.children("li:first").outerWidth(true);
          currentTempo = currentSpazio / speed * 1000;
          //x 1000 perch� tempo � in millisecondi
          scrollnews(currentSpazio, currentTempo);
  		// function setHover(){
  		// 	$line.hover(pause,resume);
  		// }
      //
  		// function pause(){
  		// 	run = false;
  		// 	$line.stop();
  		// }
      //
  		// function resume() {
  		// 	run = true;
  		// 	var offset = $line.offset().left;
  		// 	var residualSpace = offset + $line.children("li:first").outerWidth(true) - initialOffset;
  		// 	var residualTime = currentTempo / currentSpazio * residualSpace;
  		// 	scrollnews(residualSpace, residualTime);
  		// }
  		// if(settings.pause) setHover();

  		// if(settings.buttons){
      //
  		// 	var $buttons = j('<ul class="er-controls">'+
  		// 	'<li class="prev glyphicon glyphicon-chevron-left"></li>'+
  		// 	'<li class="pause glyphicon glyphicon-pause"></li>'+
  		// 	'<li class="next glyphicon glyphicon-chevron-right"></li>'+
  		// 	'</ul>');
  		// 	$buttons.insertAfter($tickercontainer);
  		// 	//DELEGATE IS BETTER!
  		// 	j("body").on("click", "#"+id+" .er-controls > .pause", function(){
  		// 		if(!run) return false;
  		// 		j(this).toggleClass("pause glyphicon-pause play glyphicon-play");
  		// 		$line.unbind('mouseenter mouseleave');
  		// 		run = false;
  		// 	});
      //
  		// 	j("body").on("click", "#"+id+" .er-controls > .play", function(){
  		// 		if(run) return false;
  		// 		j(this).toggleClass("pause glyphicon-pause play glyphicon-play");
  		// 		run = true;
  		// 		setHover();
  		// 		var offset = $line.offset().left;
  		// 		var residualSpace = offset + $line.children("li:first").outerWidth(true) - initialOffset;
  		// 		var residualTime = currentTempo / currentSpazio * residualSpace;
  		// 		scrollnews(residualSpace, residualTime);
  		// 	});
      //
  		// 	var moving = false;
      //
  		// 	j("body").on("click", "#"+id+" .er-controls > .next", function(){
  		// 		if(run){
  		// 			j("#"+id+" .er-controls > .pause").toggleClass("pause glyphicon-pause play glyphicon-play");
  		// 			run = false;
  		// 			return;
  		// 		}
  		// 		if(moving) return false;
  		// 		var spazio = $line.children("li:first").outerWidth(true);
      //     		var tempo = spazio / speed * 1000;
      //     		moving = true;
  		// 		$line.stop(true,true).animate({left: '-=' + spazio}, tempo, "linear", function () {
      //             	$line.children("li:first").appendTo($line);
      //             	$line.css("left", 0);
      //             	moving = false;
      //         	});
      //
      //         });
      //
  		// 	j("body").on("click", "#"+id+" .er-controls > .prev", function(){
  		// 		if(run){
  		// 			j("#"+id+" .er-controls > .pause").toggleClass("pause glyphicon-pause play glyphicon-play");
  		// 			run = false;
  		// 			return;
  		// 		}
  		// 		if(moving) return false;
  		// 		var spazio = $line.children("li:last").outerWidth(true);
  		// 		$line.css("left", "-"+spazio+"px");
  		// 		$line.children("li:last").prependTo($line);
      //     		var tempo = spazio / speed * 1000;
      //     		moving = true;
  		// 		$line.stop(true,true).animate({left: '+=' + spazio}, tempo, "linear", function(){
  		// 			moving = false;
  		// 		});
      //
  		// 	});
  		// }
    }
  }

  updateTweets(newFavorites){
    console.log('updating favorites list...');
    this.setState({ offline: false });

    // use local storage tweets if newFavorites is empty for some reason
    if (!newFavorites && newFavorites.length() < 1) {
      let favorites = localStorage.getItem('tweets');
      if (favorites) {
        this.setState({ favorites: JSON.parse(favorites) });
      }
    }

    let oldFavorites = this.state.favorites;
    let updatedFavorites = _.intersectionBy(oldFavorites, newFavorites, 'id_str');

    for (let t of newFavorites) {
      if (!_.some(updatedFavorites, { 'id_str': t.id_str })) {
        updatedFavorites.push(t);
      }
    }

    localStorage.setItem('tweets', JSON.stringify(updatedFavorites));
    // this.refs.ticker.addEventListener("webkitAnimationIteration", () => {
      this.setState({ favorites: updatedFavorites });
      if (!this.state.running) {
        this.setState({ running: true });
        this.hand
      }
      this.handleTickerClones();
    // });
    // this.refs.ticker.addEventListener("animationiteration", () => {
      // this.setState({ favorites: updatedFavorites });
    // });
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

      let mediaUrl = favorite.entities.media ? favorite.entities.media[0].media_url_https : null;

      return (
        <li key={favorite.id_str} ref={`tweet${favorite.id_str}`} id={favorite.id_str} className={i === 0 ? "first tweet" : "tweet"}>
          <img src={favorite.user.profile_image_url} alt="" /> <span className="author">@{favorite.user.screen_name}:</span> <span className="text">{text}</span>
          { mediaUrl &&
            <img className="image-attached" src={mediaUrl} alt="" />
          }
        </li>
      )
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
