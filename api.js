(function (exports) {
    exports.hello = function (who) {
      document.dispatchEvent(new CustomEvent('MY_API:hello', {
        detail: {
          who: who || 'world'
        }
      }));
    };
  })(window.MY_API = {});