
var KviewCellRenderer = function KviewCellRenderer () {

    'use strict';

    var imgwidth = 0;

    var setImgWidth = function setImgWidth(w){
        imgwidth = w;
    };

    var getHtml = function getHtml(idx, model) {
        return '<img data-cgid="" title="" data-url="" width="" src="img/blank.gif"><div style="position: relative;top: 0;"></div>';
    };

    var onCellRendered = function onCellRendered(cell, row, col, modelIdx, model) {
        if (modelIdx < model.size()) {
            var epub = model.getValueAt(modelIdx);
            var img = epub.replace('file/', 'img/');
            img = img.substr(0, img.lastIndexOf('.')) + '.jpg';
            cell.find('img:first').each(function () {
                var $t = $(this);
                $t.attr('src', img);
                $t.attr('data-ebook-url', epub);
                $t.attr('title', epub);
                $t.attr('width', cell.width() - 2);
            });
            cell.find('div:first').html(epub);
        }
    };

    var onCellReset = function onCellReset(cell) {
        cell.find('img:first').each(function () {
            var $t = $(this);
            $t.attr('src', 'img/blank.gif');
            $t.attr('data-ebook-url', '');
            $t.attr('title', 'empty');
            $t.attr('width', cell.width() - 2);
        });
        cell.find('div:first').html('');
    };

    return {
        setImgWidth: setImgWidth,
        getHtml: getHtml,
        onCellRendered: onCellRendered,
        onCellReset: onCellReset
    }
};