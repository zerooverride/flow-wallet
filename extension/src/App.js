/*global chrome*/

import logo from './logo.svg';
import './App.css';
import { changeColor } from './main';
import React, { useEffect, useState } from "react";

// listens for messages from the content script
// seems we can't get internal messages from the actual api library directly
// could get external messages but then have to allowlist every site in the extension manifest
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log("in APP.js");
    sendResponse({ farewell: "goodbye" });
  }
);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={changeColor}>
          Change color
        </button>
      </header>
    </div>
  );
}

export default App;
