
function YScroller(container) {
    var targetValue = -1;
    var targetTime = -1;
    var startTime = -1;
    var startValue = -1;
    var duration = 200;

    function doScroll() {
        var now = new Date().getTime();
        var currentScrollTopY = container.scrollTop();
        if (targetValue > -1 && currentScrollTopY != targetValue) {
            var ny = targetValue;

            if (now < targetTime) {
                var f = (startTime - now) / (startTime - targetTime);
                ny = startValue + f * (targetValue - startValue);
            } else {
                targetValue = -1;
            }
            container.scrollTop(ny);
            if (targetValue > -1) window.requestAnimationFrame(doScroll);
        }
    }

    function startScrolling(y){
        targetValue = y;
        if (targetValue > -1) {
            startTime = new Date().getTime();
            startValue = container.scrollTop();
            targetTime = startTime + duration;
            window.requestAnimationFrame(doScroll);
        }
    }

    return {
        /* y: -1 will stop scrolling! */
        setScrollTop: function (y) {
            startScrolling(y);
        }
    }
}