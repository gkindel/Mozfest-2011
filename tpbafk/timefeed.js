
(function () {
    var $ = jQuery;

    var defaults = {
        highlight: true,
        list : false,
        duration : null
    };

    var TimeFeed = function ( target, options ) {

        if( TimeFeed.instances[target] )
            return TimeFeed.instances[target];

        if( !( this instanceof TimeFeed))
            return new TimeFeed(target, options)

        this.config = $.extend({}, defaults, options);
        this.items = [];
        this.el = target;
        $(this.el).append("<div class='scroller'></div>");
        this.options = options;
        this.visible = true;

        TimeFeed.instances[target] = this;
    };

    TimeFeed.instances = {};

    TimeFeed.getFav = function  ( url ) {
        var matches = url.match(/(https?:\/\/[^\/]*)/);
        if( matches )
            return  matches[1] + "/favicon.ico";
    };

    TimeFeed.prototype =  {

        pageDown: function () {
            var el = $(this.el).find('.scroller');
            var h = el.height();
            var st = el.scrollTop();
            el.scrollTop(h + st);
        },

        pageUp: function () {
            var el = $(this.el).find('.scroller');
            var h = el.height();
            var st = el.scrollTop();
            el.scrollTop(h - st);
        },

        add : function (options) {

            if ( this.config.duration )
                options.end = options.start + this.config.duration;

            var el = $("<div class='item'></item>");
            el.append("<div class='time'><span class='start'>N</span>s</item>");
            el.append("<img class='ico' />");
            el.append("<div class='title'></item>");
            el.append("<div class='body'></item>");
            el.append("<a class='link'></a>");

            options._el = el;
            this.items.push(options);

            if( this.config.list )
                $(this.el).find('.scroller').append(el);
            else
                $(this.el).find('.scroller').prepend(el);

            var self = this;

            el.find('.title').html( options.title );

            if( options.body )
                el.find('.body').html( options.body );
            else
                el.find('.body').hide();

            el.find('.start').text( options.start );
            el.find('img').attr('src',  options.img || TimeFeed.getFav(options.href) );
            el.find('.link').attr('target',  "_blank");

            el.find('.link').attr('href',  options.href)
                .text(options.href)
                .click( function (e) {
                    self._player.pause();
                    e.stopPropagation();
            });

            el.click( function () {
                if( self._player.paused() )
                    self._player.pause(options.start);
                else
                    self._player.play(options.start);
            });

            this.setItem(options);
        },

        filter : function (search) {
            var self = this;

            if( search.match(/\S/) )
                this.filtered = search;
            else
                this.filtered = null
            var re = RegExp(search, 'i');


            $.each(this.items, function (i, options){
                var el = $(options._el);
                if( ! self.filtered ){
                    self.setItem(options)
                }
                else if( options.title && options.title.match(re)
                    || options.body && options.body.match(re)
                    || options.href && options.href.match(re)
                    ) {
                    self.setItem(options, true);
                }
                else {
                    self.setItem(options, false)
                }
            });
        },

        player : function (popcorn) {
            if( !(popcorn === undefined) )
                this._player = popcorn;
            return this._player;
        },


        setItem : function (options, visible, focused, now) {
            var el = $(options._el).stop();

            if( visible == null ){
                visible = this.filtered
                    ? options._visible
                    : this.config.list ? true : options._started;
            }
            else {
                options._visible = visible;
            }

            if( focused == null ){ // restore
                focused = options._running;
                now = true;
            }

            if(! this.config.highlight ) {
                focused = true;
            }

//            console.log(["filtered? ", this.filtered, options._visible,
//                options._started,
//                visible]);

            var op = focused
                ? 1
                : visible ? .6 : 0;

            el.toggle( Boolean(visible) );

            if( now )
                el.css('opacity', op);
            else
                el.animate({'opacity': op}, 1000);
        },

        focus : function (options) {
            this.setItem(options, null, true);
        },

        blur : function (options) {
            this.setItem(options, null, false);
        },

        hideAll : function () {
            $(this.el).find('.item').hide();
        },

        toggle : function (bool) {
            var show;
            if( bool == null)
                show = "toggle";
            else if( bool )
                show = 1;
            else
                show = 0;
            $('#feeddiv').stop().animate({'opacity': show});
        },

        onFirstItem : function () {
            /// abstract, callback
        },

        search : function (query) {


        }

    };
    window.timefeed = TimeFeed;
})();


(function () {
    if( ! Popcorn )
        return;

    var hasItems = false;
    Popcorn.plugin( "timefeed" , {
        _setup : function (options) {
            timefeed(options.target).player(this);
            timefeed(options.target).add(options);
        },
        start : function (event, options) {
            options._started = true;
            var tf = timefeed(options.target);
            if( ! tf.hasItems ){
                tf.hasItems = true;
                tf.onFirstItem && tf.onFirstItem();
            }
            timefeed(options.target).focus(options);
        },
        end : function (event, options) {
            timefeed(options.target).blur(options);
        },
        _teardown : function (options) {
            var tf = timefeed(options.target);
            tf.hasItems = false;
            tf.hideAll();

        }
    });

})();