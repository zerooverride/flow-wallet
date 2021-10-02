(function (exports) {
    // if we expose a named function here we still have to pass it as a string into the extension
    // small tradeoff in dev experienceA
    // this is general purpose to send any request from js to the background script (via content-script)
    exports.request = function (api_name, ...api_params) {
        // idk if this kind of thing is needed, but I don't want messages to cross streams
        // like if the site's JS calls two api, but the response for one ends up in the others promise
        // because it is listening for any message
        var trackingId = Math.floor(Math.random() * 100);

        // We want the 'api' to have an actual response, not make the site owner listen for a response message
        // so it seems kind of hacky, but give them a promise that will resolve when _we_ hear the response message
        var responsePromise = new Promise((resolve, reject) => {
            function handleEvent(event) {
                if (event.detail.trackingId === trackingId) {
                    document.removeEventListener('walletResponse', handleEvent);
                    resolve(event.detail.response); // if event was successfull, otherwise should probably reject
                }
            }
            // content-script will emit this event based on the response it gets from the background script or extension
            document.addEventListener('walletResponse', handleEvent);
        });

        // the content script will listen for this event and forward the data to the extension or background script
        // we probally just send all to the background script and it talks directly to extension if needed
        document.dispatchEvent(new CustomEvent('FlowWalletAPI', {
            detail: {
                trackingId: trackingId,
                api: api_name,
                params: api_params,
            }
        }));

        return responsePromise;
    };
})(window.flow_wallet = {});