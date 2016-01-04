(function () {

    "use strict";

    module.exports = hes.convert = hes;

    hes.start = function start(options) {
        var server = require('./lib/server.js');
        server.start(options);
    };

    hes();

    function hes() {

    }

})();