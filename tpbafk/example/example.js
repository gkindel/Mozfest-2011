
$( function () {
    var fullwidth = false;


    $('#video').click( function () {
        toggleOverlay();
    });

    $('.feed').mouseenter( function (){
        example.pause();
    });

    $('#video').mouseenter( function (){
        example.play();
    });
});


function toggleOverlay( bool, now ){
    fullwidth = ! ( bool == null ? fullwidth : bool );
    var cw = $('.container').width();
    var tw = $('#feeddiv').width();
    var vw = fullwidth ? cw : cw - tw;

    if( now )
        $('#video').width(vw);
    else
        $('#video').animate({width:  vw}, 1000);

    $('.feed').stop().animate({
        'width': (fullwidth ? 0 : 300),
        'opacity': (fullwidth ? 0 : 1)
    }, 1000);
}
