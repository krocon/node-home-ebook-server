(function(){
    "use strict";

    var server = require('./index.js');

    var options = {
        port: 3000,
        baseDir: '/Users/marc/ebooks/Romane',
        bookExtensions: ['.epub'],

        trashDir: '/Users/marc/ebooks/trash',
        deletable: false,

        copyDir : '/Volumes/KOBOeReader', // tested with Kobo Aura H2O. Reader must be connected via USB.

        tmpDir: '/Volumes/ramdisk/tmp',

        sendOptions: {
            sendattachment: {
                title: 'Send book',
                transport : 'smtps://ABC@gmail.com:mtdqeyvomcrebkaft@smtp.gmail.com',
                from: 'ABC@gmail.com',    // sender address
                to: 'ABC@gmail.com',      // list of receivers
                subject: 'home ebook server' // Subject line
            },
            sendlink: {
                title: '@getpocket',
                transport : 'smtps://ABC@gmail.com:mtdqeyvomcrebkaft@smtp.gmail.com',
                from: 'ABC@gmail.com',   // sender address
                to: 'add@getpocket.com', // list of receivers
                subject: 'filename'      // Subject line
            }
        }, // null -> send buttons are hidden

        title: 'ebooks',
        thumbsDims : [
            {width: 105, height: 150},
            {width: 210, height: 300},
            {width: 315, height: 450},
            {width: 420, height: 600}
        ],
        dimIndex : 1,
        initialFilter: '-categories krimi'
    };
    server.start(options);

    var ecomic = require('ebook-cover-generator');
    ecomic.extractCoverGlob(options.baseDir + '/**/*.epub', {
    //ecomic.extractCoverGlob('/Volumes/2TB/jdownload/_books/**/*.epub', {
        overwrite:false,
        quite:true,
        tmpDir: '/Volumes/ramdisk/tmp',
        outputs:[
            {nameExtension: "", dimension: [420, 600]}
        ]
    }, function(err, files){
        if (err) return console.error(err);
        console.info(files);
    });

})();