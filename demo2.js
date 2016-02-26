(function(){
    "use strict";

    var server = require('./index.js');

    var options = {
        baseDir: '/Volumes/data/ebooks/comics/_deu',
        //baseDir: '/Volumes/2TB/jdownload/_comics_neu',
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

    var ecomic = require('ecomic');
    ecomic.extractCoverGlob(options.baseDir + '/**/*.cb*', {
        overwrite:false,
        quite:true,
        tmpDir: '/Volumes/ramdisk/tmp',
        //outputDir: '_cover', //  null or '' -> same dir as cbr folder, else outputDir is relative to cbr
        outputs:[
            {nameExtension: "", dimension: [210, 300]}, // abc.cbr -> abc.jpg
            {nameExtension: "_xl", dimension: [840, 1200]} // abc.cbr -> abc_xl.jpg
        ]
    }, function(err, files){
        if (err) return console.error(err);
        console.info(files);
    });


})();