// after the content script connects to this background script we will
// us this to respond after the work is done
var contentToBackgroundPort;

// the content-script connects to background, so listen for its messages here
chrome.runtime.onConnect.addListener(function(port){
    // this was in the example
    console.assert(port.name === 'content-background');

    // save the port for responding later
    contentToBackgroundPort = port;

    port.onMessage.addListener(function(msg){
        // if we need the extension UI, we can't open the popup directly
        // so just open the same content in a new window!
        // even if the extension popup is open, a user clicking anything on the page, say to trigger a login, will close it
        // and require us to use this manual popup
        // this should happen for any api that require the UI
        if(msg.api === 'get_signed_payload'){
            var params = msg.params;
            console.log("trying to open");
            chrome.tabs.create({
                url: chrome.runtime.getURL('extension/build/index.html'),
                active: false
            }, function(tab) {
                // After the tab has been created, open a window to inject the tab
                // because we don't actually want a tab, we want a popup window
                chrome.windows.create({
                    tabId: tab.id,
                    type: 'popup',
                    focused: true
                }, () => {
                    console.log("sending begin_sign")
                    // then tell the tab what we want after it has loaded
                    chrome.tabs.onUpdated.addListener(function listener (tabId, info) {
                        if (info.status === 'complete' && tabId === tab.id) {
                            chrome.tabs.sendMessage(tabId,
                                {
                                    trackingId: msg.trackingId,
                                    api: "begin_sign",
                                    params: params
                                }
                            );  
                        }
                    });
                });
            });

        }
    })
});

// the extensions sends messages without a constant connection, so listen for those here
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.api == 'approve_sign'){
            console.log("a signing was approved?");
            console.log(request);

            // here we would actually do the signing operation against the chain
            var response = { status: 'we signed ' + request.response.payload + ' with account: ' + request.response.account };

            // then tell the extension its done so the window can close
            sendResponse({status: "thanks, signing was successful you can close"});

            // then tell the content script, so it can respond to the original api call
            contentToBackgroundPort.postMessage({
                trackingId: request.trackingId,
                response: response
            })
        }
    }
);