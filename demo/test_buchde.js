(function () {
    'use strict';

    var grabber = require('./../lib/grabbuchde.js');

    grabber.grab('Aakeson, Kim Fupz - Taeter wie wir', function (error, res) {
        console.log('\n');
        console.log(error, res);
    });

    grabber.grab('Bassner, Simon - Spurlos - Sylt-Thriller', function (error, res) {
        console.log('\n');
        console.log(error, res);
    });

    grabber.grab('Camp, Candace - Gefaehrliche Geheimnisse einer Lady (Historical Gold Extra 75)', function (error, res) {
        console.log('\n');
        console.log(error, res);
    });

    grabber.grab('Adams, Scott - Die Kunst des erfolgreichen Scheiterns', function (error, res) {
        console.log('\n');
        console.log(error, res);
    });

})();