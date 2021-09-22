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
        document.dispatchEvent(new CustomEvent('FlowWalletAPI', {
            detail: {
                api: 'set_two_thing',
                params: [param1, param2],
            }
        }));
    };
})(window.flow_wallet = {});