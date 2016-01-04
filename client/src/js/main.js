$(function () {
    'use strict';


    var triggerFilter = function triggerFilter() {
        if (filtertimeout !== null) window.clearTimeout(filtertimeout);
        filtertimeout = window.setTimeout(function () {
            detailsOpened = false;
            kview1.scroll2Top();

            model.setFilter($filter.val());
            kview1.updateView();
            $info.html(model.getCountText());
            filtertimeout = null;
        }, 222);
    };

    var toggleSize = function toggleSize() {
        sizeIdx++;
        if (sizeIdx >= dims.length) sizeIdx = 0;
        kviewCell = dims[sizeIdx];
        kviewCellRenderer.setImgWidth(dims[sizeIdx].width);
        kview1.repaint();
    };

    var repaintLoadingInfo = function repaintLoadingInfo() {
        $info.html(loadingInfo);
    };

    var load = function load() {
        $info.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Loading...');
        // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest?redirectlocale=en-US&redirectslug=DOM/XMLHttpRequest/Using_XMLHttpRequest#Monitoring_progress
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status === 200) {
                loadingInfo = '';
                onDataLoaded(JSON.parse(this.responseText));
                $filter.show().val(initialFilter).change();
                window.requestAnimationFrame(repaintLoadingInfo);
            }
        };
        xhr.onerror = function (e) {
        };
        xhr.addEventListener("progress", function (oEvent) {
            if (oEvent.lengthComputable) {
                loadingInfo = parseInt(100 * oEvent.loaded / oEvent.total) + ' %';
                window.requestAnimationFrame(repaintLoadingInfo);
            }
        }, false);
        xhr.open("get", URL, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xhr.send();
    };

    var cutPath = function cutPath(url) {
        var idx = url.lastIndexOf('/');
        if (idx === -1) idx = url.lastIndexOf('\\');
        if (idx === -1 || idx >= url.length - 2) return url;
        return url.substring(idx + 1);
    };

    var cutSuffix = function cutSuffix(url) {
        var idx = url.lastIndexOf('.');
        if (idx === -1) return url;
        return url.substring(0, idx);
    };

    var onDataLoaded = function onDataLoaded(res) {
        model.setFiles(res);
        model.setFilter(initialFilter);
        kview1.repaint();
        $info.html(model.getCountText());
    };

    var onImgMouseOver = function onImgMouseOver() {
        if (detailsOpened) return;
        var url = $(this).attr('data-ebook-url').replace('file/', '');
        $info.html(url);
    };

    var clickCount = 0;
    var onImgClicked = function onImgClicked() {
        clickCount++;
        var imgele = $(this);
        var url = imgele.attr('data-ebook-url');
        var img = imgele.attr('src');
        var title = cutPath(cutSuffix(url));
        var rendered = Mustache.render(templateDetails, {
            title: title,
            coverurl: img,
            epuburl: url,
            copyDir: copyDir,
            sendattachment: sendOptions && sendOptions.sendattachment,
            sendlink: sendOptions && sendOptions.sendlink,
            viewOnline: url.indexOf('.epub') > -1
        });
        var onDeleteClicked = function onDeleteClicked() {
            if (!confirm('Do you really want to delete ' + url + '?')) return;
            $.ajax({
                url: url.replace('file/', 'delete/'),
                traditional: true,
                success: function (error) {
                    if (error) {
                        console.log('error', error);
                        alert(error);
                    } else {
                        model.remove(url);
                        detailsDlg.modal('hide');
                        kview1.repaint();
                    }
                }
            });
        };
        var onBtnClicked = function onBtnClicked(action) {
            $.ajax({
                url: url.replace('file/', action + '/'),
                traditional: true,
                success: function (error) {
                    if (error) {
                        //console.error('error', error);
                        $.notify({message: 'Error' + JSON.stringify(error)}, {type: 'danger', z_index: 2222, newest_on_top: true});
                    } else {
                        $.notify({message: action + " done successfully."}, {type: 'success', z_index: 2222, newest_on_top: true});
                    }
                }
            });
        };
        detailsDlg.html(rendered);
        detailsDlg.modal({backdrop: 'static'});
        detailsDlg.find('.delete-btn').click(onDeleteClicked);
        detailsDlg.find('.copy-btn').click(function () {
            $(this).attr('disabled', 'disabled');
            onBtnClicked('copy');
        });
        detailsDlg.find('.sendattachment-btn').click(function () {
            $(this).attr('disabled', 'disabled');
            onBtnClicked('sendattachment');
        });
        detailsDlg.find('.sendlink-btn').click(function () {
            $(this).attr('disabled', 'disabled');
            onBtnClicked('sendlink');
        });

        (function (id) {
            $.get("grab?s=" + title, function (json) {
                if (id === clickCount) {
                    var rendered = Mustache.render(templateDetailsData, json);
                    $('#detailsInfo').html(rendered);
                }
            });
        })(clickCount);

    };

    var initPage = function initPage(options) {
        dims = options.thumbsDims ? options.thumbsDims : [
            {width: 105, height: 150},
            {width: 210, height: 300},
            {width: 315, height: 450},
            {width: 420, height: 600}
        ];
        sendOptions = options.sendOptions;
        copyDir = options.copyDir ? options.copyDir : null;
        sizeIdx = options.dimIndex ? options.dimIndex : 0;
        initialFilter = options.initialFilter ? options.initialFilter : '';
        title = options.title ? options.title : 'books';
        document.title = title;
        $appTitle.html(title);

        if (screenfull.enabled) {
            $fullScreenToggler.show().click(function () {
                screenfull.toggle();
            });
            document.addEventListener(screenfull.raw.fullscreenchange, function () {
                if (screenfull.isFullscreen) {
                    $fullScreenTogglerIcon.addClass('glyphicon-resize-small').removeClass('glyphicon-fullscreen');
                } else {
                    $fullScreenTogglerIcon.addClass('glyphicon-fullscreen').removeClass('glyphicon-resize-small');
                }
            });
        }

        kviewCell = dims[sizeIdx];

        detailsOpened = false;
        templateDetails = $('#templateDetails').html();
        templateDetailsData = $('#templateDetailsData').html();

        model = new EbookModel();
        kviewCellRenderer = new KviewCellRenderer();

        kview1 = new KView($gridViewDiv, {
            snapToGrid: false,
            snapToGridOffset: $nav.height(),
            windowMode: true,
            model: model,
            cellRenderer: kviewCellRenderer,
            getCellWidth: function () {
                return kviewCell.width;
            },
            getCellHeight: function () {
                return kviewCell.height;
            },
            getPaddingTop: function () {
                return $nav.height();
            },
            getPaddingBottom: function () {
                return 0;
            }
        });
        kviewCellRenderer.setImgWidth(dims[sizeIdx].width);
        $filter.on('dblclick', function () {
            $filter.val('').change();
        });
        $gridViewDiv.on('mouseenter', 'img[data-ebook-url]', onImgMouseOver);
        $gridViewDiv.on('click', 'img[data-ebook-url]', onImgClicked);

        load();

        $('#filter-input-group :input').on('change keyup', triggerFilter);

        $sizeToggler.on('click', toggleSize);

        Mustache.parse(templateDetails);   // optional, speeds up future uses
    };

    var loadingInfo = '';
    var URL = 'files.json';
    var filtertimeout = null;
    var $nav = $('#navbar');
    var $gridViewDiv = $('#ebook-grid-view');
    var $info = $('#info');
    var $filter = $('#filter');
    var $fullScreenToggler = $('#fullScreenToggler');
    var $fullScreenTogglerIcon = $('#fullScreenToggler span');
    var $appTitle = $('#appTitle');
    var $sizeToggler = $('#sizeToggler');
    var detailsDlg = $('#detailsDlg');

    var dims, sizeIdx, initialFilter, kviewCell, detailsOpened, templateDetails, templateDetailsData, model, kviewCellRenderer, kview1, title, sendOptions, copyDir;

    $.get("init.json", function (json) {
        initPage(json);
    });


});

