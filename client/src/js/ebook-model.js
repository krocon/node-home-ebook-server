var EbookModel = function EbookModel() {

    'use strict';

    var files;
    var filtered;
    var filterWords = [];
    var filterText;

    var setFiles = function setFiles(f) {
        files = f;
        filtered = f;
    };
    var remove = function remove(f) {
        var idx = files.indexOf(f);
        if (idx > -1) {
            files.splice(idx, 1);
        }
        reFilter();
    };
    var size = function size() {
        if (filtered) return filtered.length;
        return 0;
    };
    var getCountText = function getCountText() {
        if (!files) return '';
        if (filtered.length === files.length) return files.length;
        return filtered.length + '/' + files.length;
    };
    var reFilter = function reFilter() {
        setFilter(filterText);
    };
    var setFilter = function setFilter(filterStr) {
        filterText = filterStr;
        var isOk = function isOk(value) {
            if (filterStr === '') return true;
            for (var i = 0; i < filterWords.length; i++) {
                var word = filterWords[i];
                if (word && word.length > 0) {
                    var chr0 = word.substr(0, 1);
                    if (chr0 === '!' || chr0 === '-') {
                        // '-abc': word (abc) is not allowed:
                        if (word.length > 1 && value.toLowerCase().indexOf(word.substr(1)) > -1) return false;
                    } else {
                        if (value.toLowerCase().indexOf(word) === -1) return false;
                    }
                }
            }
            return true;
        };
        if (filterStr === '') {
            filterWords = [];
            filtered = files;
        } else {
            filterWords = filterStr.toLowerCase().split(' ');
            filtered = files.filter(isOk);
        }
        filtered.sort();
    };
    var getValueAt = function getValueAt(idx) {
        if (!filtered) return null;
        if (idx < filtered.length) return filtered[idx];
        return null;
    };

    return {
        remove: remove,
        setFiles: setFiles,
        size: size,
        getValueAt: getValueAt,
        getCountText: getCountText,
        setFilter: setFilter
    }
};