// Inject API to web page
var s = document.createElement('script');
s.src = chrome.extension.getURL('api.js');
s.onload = function () {
    this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(s);


// Since we cannot send an internal message directly from api.js, we send an event from there instead
// and listen for it here, where we _can_ actually send an internal message to the extension

// Register event to allow dialog between page-wide and extension-wide code
// this is a general purpose conduit for sending JS api request to the extension
document.addEventListener('FlowWalletAPI', function (e) {
    chrome.runtime.sendMessage(
        {
            api: e.detail.api,
            params: e.detail.params
        },
        function (response) {
            document.dispatchEvent(new CustomEvent('walletResponse', {
                detail: {
                    api: e.detail.api,
                    response: response
                }
            }));
        });
});