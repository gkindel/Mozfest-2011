/*
 scroller.js - tiny alternative to iScroll

 Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 2011 : gkindel : initial prototype
 */


(function () {
    var $ = jQuery;

    var defaults = {
//        scrollX : true,
        scrollY : true
    };

    var Scrollable = function (target, options) {
        if( Scrollable.instances[target] )
            return Scrollable.instances[target];

        if( !( this instanceof scrollable))
            return new Scrollable(target, options)

        Scrollable.instances[target] = this;

        this.config = $.extend({}, defaults, options);
        this.el = target;


        this.addListeners();

        return this;
    };

    Scrollable.instances = [];
    Scrollable.prototype = {

        addListeners : function () {
            var self = this;
            var el = $(this.el);
            var touchY, touchTime, timer;

            var scrollBy = function (delta) {
                var st = el.scrollTop();
                el =  el.scrollTop(st + delta);
            };

            var startInertia = function (delta) {
                if( ! delta  )
                    return;
                clearInterval(timer);
                timer = setInterval(function () {
                    delta = delta * .9;
                    if(! delta ||  (delta > -.5 && delta < .5) )
                        clearInterval(timer);
                    else
                        scrollBy(delta);
                }, 10);
            };

            var mousescroll = function (e){
                var delta = -10 * (e.wheelDelta ? e.wheelDelta/40 : e.detail ? -e.detail/3 : 0);
                scrollBy(delta);
                e.preventDefault();
            };

            var touchscroll = function (e){
                var touches = e.originalEvent.touches;
                var t = touches[0];
                var delta = 0;

                if( e.type == "touchend" ){
                    touchY = null;
                    e.target.blur();
                }
                else if( e.type == "touchstart" ){
                    touchY = t.pageY;
                }
                else if( e.type == "touchmove" && touchY != null) {
                    var st = el.scrollTop();
                    delta = touchY - t.pageY
                    scrollBy(delta);
                    touchY = t.pageY;
                    startInertia(delta);
                    e.preventDefault();
                }
            };

            el.bind('DOMMouseScroll mousewheel', mousescroll);
            el.bind('touchmove touchstart touchmove', touchscroll);
        }

    };

    window.scrollable = Scrollable;

})();