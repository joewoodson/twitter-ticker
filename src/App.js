import React, { Component } from 'react';
import TickerTitle from './components/ticker-title';
import Ticker from './components/ticker';
import './css/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <TickerTitle />
        <Ticker />
      </div>
    );
  }
}

export default App;
