(function(){
    "use strict";

    var server = require('./index.js');

    var options = {
        baseDir: '/Volumes/data/ebooks/comics/_deu',
        trashDir: '/Volumes/data/ebooks/comics/trash',
        bookExtensions: ['.cbz', '.cbr'],
        port: 3001,
        deletable: true,

        title: 'comics',
        thumbsDims : [
            {width: 83, height: 150},
            {width: 196, height: 300},
            {width: 329, height: 450},
            {width: 392, height: 600}
        ],
        dimIndex : 1,
        initialFilter: ''
    };
    server.start(options);

})();