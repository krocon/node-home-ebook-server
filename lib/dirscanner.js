(function () {

    'use strict';

    var recursive = require('recursive-readdir');
    var path = require('path');

    exports.dirscanner = function () {
        var files = [];
        var dir;
        var bookExtensions;

        var getInfo = function getInfo() {
            return '   ...' + files.length + ' books found at ' + dir;
        };

        var getFiles = function getFiles() {
            return files;
        };

        var ignoreFunc = function ignoreFunc(file, stats) {
            if (!file || !stats) return true;
            if (stats.isDirectory()) return false;

            for (var i = 0; i < bookExtensions.length; i++) {
                if (path.basename(file).indexOf(bookExtensions[i]) > -1) return false;
            }
            return true;
        };

        /**
         * We want to have one version of an ebook only (not abc.cbz and abc.cbr).
         * @param candidates
         * @param candidate
         * @returns {boolean}
         */
        var shallAdd = function shallAdd(candidates, candidate) {
            if (bookExtensions.length === 1) {
                return true;
            }
            var ext = path.extname(candidate);
            var bix = bookExtensions.indexOf(ext);
            if (bix === 0) {
                return true;
            }
            for (var i = 0; i < bix; i++) {
                var better = candidate.replace(ext, bookExtensions[i]);
                if (candidates.indexOf(better) === -1) {
                    return true;
                }
            }
            return false;
        };

        var scan = function scan(baseDir, _bookExtensions) {
            dir = baseDir;
            bookExtensions = _bookExtensions;

            recursive(dir, [ignoreFunc], function (err, list) {
                if (err) return console.error(err);

                for (var i = 0; i < list.length; i++) {
                    if (shallAdd(list, list[i])) {
                        files.push(list[i].replace(baseDir, 'file'));
                    }
                }
                console.log(getInfo());
            });
        };

        var ret = {};
        ret.scan = scan;
        ret.getInfo = getInfo;
        ret.getFiles = getFiles;
        return ret;
    };

})();