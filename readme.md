# home-ebook-server

Webserver for own ebook content: comics and epubs (cbr,cbz,cb7,epub).

This tool serves ebooks of a given directory (and sub directories).
Depending on the bookExtensions option one can show comics, ebooks or something else. 
If for a book file (abc.cbr) a thumb file exists (abc.jpg), the thumb will be displayed instead of the name.

In the browser: all books are displayed in a thumb view. This view is optimized for a large number of books.
With help of a simple text input one can filter the list of the books.

![screen](https://cloud.githubusercontent.com/assets/11378781/13724806/e6c1cd10-e890-11e5-9a82-668d7517dd64.jpg)

At the moment I'm working on a new version based on Google Polymer. You can find it here: [poly-ebook-server](https://www.npmjs.com/package/poly-ebook-server).

## Getting started



### ebook-cover-generator
This tool doesn't generate thumbs of your ebook.
If you want to do this, you can use [ebook-cover-generator](https://www.npmjs.com/package/ebook-cover-generator).
On Mac OS X I recommend this tool: [cover-generator-by-quicklook](https://www.npmjs.com/package/cover-generator-by-quicklook).

## Usage (script)
```js
var server = require('home-ebook-server'); 
server.start(options<Object>);
```

### Examples

#### Example: simple call
```js
(function(){
  "use strict";
  var server = require('home-ebook-server');
  var options = {
    baseDir: '/Volumes/data/ebooks/comics/_deu',
    bookExtensions: ['.cbz', '.cbr'],
    port: 3001,
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
```
#### Second Example: 
```js
var server = require('home-ebook-server');
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
```

