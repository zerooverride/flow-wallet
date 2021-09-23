(function (exports) {

    exports.get_one_thing = function (one_thing) {
        document.dispatchEvent(new CustomEvent('FlowWalletAPI', {
            detail: {
                api: 'get_one_api',
                params: one_thing
            }
        }));
    };

    exports.set_two_things = function (param1, param2) {
        var responsePromise = new Promise((resolve, reject) => {
            function handleEvent(event) {
                if (event.detail.api === 'set_two_things') {
                    document.removeEventListener('walletResponse', handleEvent);
                    resolve(event);
                }
            }
            document.addEventListener('walletResponse', handleEvent);
        });
        document.dispatchEvent(new CustomEvent('FlowWalletAPI', {
            detail: {
                api: 'set_two_things',
                params: [param1, param2],
            }
        }));
        return responsePromise;
    };
})(window.flow_wallet = {});