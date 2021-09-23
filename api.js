(function (exports) {
    // if we expose a named function here we still have to pass it as a string into the extension
    // small tradeoff in dev experience
    exports.request = function (api_name, ...api_params) {
        var responsePromise = new Promise((resolve, reject) => {
            function handleEvent(event) {
                if (event.detail.api === api_name) {
                    document.removeEventListener('walletResponse', handleEvent);
                    resolve(event); // if event was successfull, otherwise should probably reject
                }
            }
            document.addEventListener('walletResponse', handleEvent);
        });
        document.dispatchEvent(new CustomEvent('FlowWalletAPI', {
            detail: {
                api: api_name,
                params: api_params,
            }
        }));
        return responsePromise;
    };
})(window.flow_wallet = {});