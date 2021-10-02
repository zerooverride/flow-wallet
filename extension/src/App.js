/*global chrome*/

import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";

function approveSign(trackingId, approved, account, payload){
  // tell the background script signing was approved (or not)
  chrome.runtime.sendMessage(
    {   
      api: "approve_sign",
      trackingId: trackingId,
      response: {
        approved: approved,
        account: account,
        payload: payload
      }
    }, function(response) {
      console.log("approve_sign response:")
      console.log(response);

      // if the actual signing operation was successful, close the window
      // otherwise we should probably go to an error state
      //if response.status === true - or something like that
      //window.close();
      //else
      // do something here to put the UI in an error state
  });
}

function App() {
  // should use a proper statemanagement solution
  const [tracker, setTracker] = useState(0);
  const [account, setAccount] = useState(0);
  const [payload, setPayload] = useState(0);

  // listens for messages from the content or background script here.
  // you can't get internal messages from the actual api library directly
  // could get external messages but then have to allowlist every site in the extension manifest
  // this is inside app so it can use setTracker, otherwise it doesn't need to be
  chrome.runtime.onMessage.addListener(
    (request) => {
      if(request.api == 'begin_sign'){
        console.log("begin_sign app.js got: ");
        console.log(request);
        // show this sign request
        // in reality this would cause more than the text in an existing button to change
        setTracker(request.trackingId);
        setAccount(request.params[0]);
        setPayload(request.params[1]);
      }
    }
  );

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
        <button onClick={() => approveSign(tracker, true, account, payload)}>
          Approve Signing of {payload} with {account}
        </button>
        <button onClick={() => approveSign(tracker, false, account, payload)}>
          Decline Signing of {payload} with {account}
        </button>
      </header>
    </div>
  );
}

export default App;
