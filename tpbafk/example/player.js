

var Overlay = function (popcorn) {
    var self = this;

    this.opened = false;

    popcorn.listen("pause", function () {
        $('.bigplay').show();
    });

    popcorn.listen("play", function () {
        $('.bigplay').hide();
    });

//    $('.tab').bind("click", function (e){
//        self.toggle();
//        e.preventDefault();
//    });

    $('#video').bind('click touchend', function (){
        if( popcorn.paused() )
            popcorn.play();
        else {
            popcorn.pause();
        }
    });

    $('.search').bind('focus', function () {
        $('.search').css('opacity', 1)
    });

    $('.search').bind('blur', function () {
        var q = $('.search').val();
        if( q.match(/\S/) )
            $('.search').css('opacity', 1);
        else
            $('.search').css('opacity', .6)
    });

    $('.search').bind("keyup change", function (e){
         var q = $('.search').val();
        setTimeout( function () {
            timefeed('#feeddiv').filter(q)
        }, 50);

    });

    $('.bigplay').click( function () {
        popcorn.play();
    });

    this.toggle(false, true);
    $('.tab').hide();
};

Overlay.prototype = {
    toggle : function ( bool, now ){
        var opened = ( bool == null ? ! this.opened : bool );
        var fw = opened ? $('#feeddiv').width() : 0;
        var tw = $('.tab').outerWidth();

        var time = now ? 0 : 1000;

        $('#videodiv').stop().animate({right: fw + tw}, time);

        $('.drawer').stop().animate({
            'width': fw
        }, time);

        $('.column').stop().animate({
            'opacity': (opened ? 1 : 0)
        }, time, function () {
            var tab = $('.tab');
            tab.find('.opened').toggle(opened);
            tab.find('.closed').toggle(!opened);
        });

        this.opened = opened;
        $('.tab').show();
    }
};


