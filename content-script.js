// Inject API to web page
var s = document.createElement('script');
s.src = chrome.extension.getURL('api.js');
s.onload = function () {
    this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(s);

// Since we cannot send an internal message directly from api.js, we send an event from there instead
// and listen for it here, where we _can_ actually send an internal message to the extension
// this is a general purpose conduit for sending JS api request to the background script or extension

// connect to the background script for message passing
var port = chrome.runtime.connect({name: 'content-background'});

// this is where we get requests from api.js
document.addEventListener('FlowWalletAPI', function (e) {
    port.postMessage({
        trackingId: e.detail.trackingId,
        api: e.detail.api,
        params: e.detail.params
    });
});

// once the background script has handled a message, it will repond with one
port.onMessage.addListener(function(msg){
    // api.js will wait for this response for the api it called
    document.dispatchEvent(new CustomEvent('walletResponse', {
        detail: {
            trackingId: msg.trackingId,
            response: msg.response
        }
    }))
})