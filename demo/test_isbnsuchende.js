(function () {
    'use strict';

    var isbnde = require('./../lib/grabisbnsuchende.js');

    isbnde.grab('Aakeson, Kim Fupz - Taeter wie wir', function(error, res){
        console.log(error, res)
    });

})();