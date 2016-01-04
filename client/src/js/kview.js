

$(function() {
    // RequestAnimationFrame polyfill for older browsers
    var rafPolyfill = function() {
        var lastTime, vendors, x;
        lastTime = 0;
        vendors = ["webkit", "moz"];
        x = 0;
        while (x < vendors.length && !window.requestAnimationFrame) {
            window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
            window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
            ++x;
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback, element) {
                var currTime, id, timeToCall;
                currTime = new Date().getTime();
                timeToCall = Math.max(0, 16 - (currTime - lastTime));
                id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
    };
    rafPolyfill();
});



function KView(container, options) {
    'use strict';

    function translateXY(elm, x, y) {
        var translate = 'translate3d(' + x + 'px,' + y + 'px, 0px)';
        elm.css({
            '-webkit-transform' : translate,
            '-moz-transform'    : translate,
            '-ms-transform'     : translate,
            '-o-transform'      : translate,
            'transform'         : translate
        });
    }

    function onScrolled() {
        // user scrolling finished (250 ms ago):
        getYScroller().setScrollTop(yscrollTargetValue);
    }

    function getYScroller() {
        if (yScroller===null) yScroller = new YScroller(_options.windowMode ? $window : $container);
        return yScroller;
    }

    function repaintView() {
        var paddingTop = _options.getPaddingTop();
        var paddingBottom = _options.getPaddingBottom();
        var cellHeight = _options.getCellHeight();
        var cellWidth = _options.getCellWidth();
        var containerHeight = _options.windowMode ? $window.height() : $container.innerHeight();
        var containerWidth = $container.width();
        var size = model.size();
        var snapToGridOffset = _options.snapToGridOffset || 0;

        var colCount = Math.floor(containerWidth / cellWidth);
        var rowCount = Math.round(0.499999999 + (size/colCount));
        var innerDivHeight = rowCount * cellHeight + paddingTop + paddingBottom;
        $innerDiv.css({height:innerDivHeight+'px'});


        var relativeOffsetTop = _options.windowMode ? $window.scrollTop() : (Math.abs($container.offset().top - $innerDiv.offset().top));

        var firstVisibleRow = Math.round(-0.499999 + relativeOffsetTop / cellHeight);
        var visibleRowCount = Math.round(0.499999999 + containerHeight / cellHeight) + 1;
        var visibleCellCount = Math.min(visibleRowCount * colCount, model.size());
        var i;

        var firstVisibleCell = firstVisibleRow * colCount;

        if (_options.snapToGrid) {
            var y = -1;
            var md = relativeOffsetTop % cellHeight;
            if (md > cellHeight/2 && md < cellHeight - _options.snapTolerance - snapToGridOffset) {
                y = (firstVisibleRow +1) * cellHeight + paddingTop;

            } else if (md < cellHeight/2 && md > _options.snapTolerance) {
                y = (firstVisibleRow) * cellHeight + paddingTop;
            }
            yscrollTargetValue = y - snapToGridOffset;
        }

        // We will recycle the already added cells and starting at cells.length:
        var html = '';
        for (i = cells.length; i < visibleCellCount; i++) {
            html = html + '<div class="k-view-cell" id="k-view-cell-' + i + '"></div>';
        }
        if (html.length > 0) $innerSmallDiv.append(html); // all cells are now in the inner div.

        // move the inner div to viewport:
        translateXY($innerSmallDiv, 0, firstVisibleRow * cellHeight + paddingTop);

        // We will keep in mind the new added cells as jquery object:
        for (i = cells.length; i < visibleCellCount; i++) {
            cells[i] = $('#k-view-cell-' + i);
        }

        // for all cells we have to set the dimension:
        var dimCss = {width: cellWidth + 'px', height: cellHeight + 'px'};
        for (j = 0; j < cells.length; j++) {
            cells[j].css(dimCss);
        }

        i=0;
        for (var row = 0; row < visibleRowCount; row++) {
            for (var col = 0; col < colCount; col++) {
                var cell = cells[i];
                if (cell) {
                    var modelIdx = firstVisibleCell + i;
                    if (!cell.hasClass('kview-cell-rendered')) {
                        // for new cells (or in case of non optimized rendering) we have to set the inner cell html:
                        cell.html(cellRenderer.getHtml(modelIdx, model));
                        cell.addClass('kview-cell-rendered');
                    }
                    // let the renderer work on the added cell:
                    cellRenderer.onCellRendered(cell, row, col, modelIdx, model);
                }
                i++;
            }
        }
        for (var j = i; j < cells.length; j++) {
            cellRenderer.onCellReset(cells[j]);
        }
        if (containerHeight===0) {
            triggerRenderTask();
        } else {
            _options.onRendered(cells);
        }
    }

    function init() {
        $container.on('scroll resize', function() {
            triggerRenderTask();
            triggerScrollingFinishedTimer();
        });
        if (_options.windowMode) {
            $window.on('scroll resize', function () {
                triggerRenderTask();
                triggerScrollingFinishedTimer();
            });
        }
        triggerRenderTask();
    }

    function triggerScrollingFinishedTimer() {
        if (scrollingFinishedTimer != null) window.clearTimeout(scrollingFinishedTimer);
        scrollingFinishedTimer = window.setTimeout(function () {
            onScrolled();
        }, 500);
    }

    function triggerRenderTask() {
        window.requestAnimationFrame(repaintView);
    }

    function updateView() {
        for (var j = 0; j < cells.length; j++) {
            cellRenderer.onCellReset(cells[j]);
            cells[j].removeClass('kview-cell-rendered')
        }
        window.requestAnimationFrame(repaintView);
    }

    function _scroll2Top() {
        if (_options.windowMode) {
            $window.scrollTop(0);
        } else {
            $container.scrollTop(0);
        }
        triggerRenderTask();
    }

    var _options = {
        snapToGrid: false,
        snapTolerance: 1,
        windowMode: false,

        model: function () {
            return {
                size: function () { return 0; },
                getValueAt: function (idx) { return null; }
            }
        },
        cellRenderer: function () {
            return {
                getHtml: function (modelIdx, model) { return ''; },
                onCellRendered: function (cell, row, col, modelIndex, model) {},
                onCellReset: function (cell) {}
            }
        },

        getCellWidth: function() { return 250; },
        getCellHeight: function() { return 300; },
        getPaddingTop: function() { return 0; },
        getPaddingBottom: function() { return 0; },

        onRendered: function(){}
    };
    for (var key in options) {
        if (options.hasOwnProperty(key))_options[key] = options[key];
    }
    var model = _options.model;
    var cellRenderer = _options.cellRenderer;
    var $container = $(container);
    var $window = $(window);
    $container.html('<div class="k-view-inner-big-div"><div class="k-view-inner-small-div"></div></div>');
    var $innerDiv = $container.find('div:first');
    var $innerSmallDiv = $innerDiv.find('div:first');
    var cells = [];
    var scrollingFinishedTimer=null;

    var yScroller = null;
    var yscrollTargetValue = -1;

    init();

    return {
        repaint: triggerRenderTask,
        updateView: updateView,
        scroll2Top: _scroll2Top
    };
}

