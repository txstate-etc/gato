jQuery(document).ready(function($) {
  $('body').after('<div id="gato-share-panel">'+
  '<a class="twitter" href="" target="_blank"><i class="fa fa-twitter"><span class="visuallyhidden">Share on Twitter</span></i></a>'+
  '</div>');
  var sharepanel = $('#gato-share-panel');
  var $lnk;
  $('[data-gato-share-link]').on('mouseover focus click', function() {
    $lnk = $(this);
    sharepanel.find('.twitter').attr('href',
      'http://twitter.com/intent/tweet?text='+encodeURIComponent($lnk.data('gato-share-text'))+
      '&url='+encodeURIComponent($lnk.data('gato-share-link')));
    sharepanel.css({left: $lnk.offset().left+'px', top: ($lnk.offset().top+$lnk.outerHeight())+'px'});
  }).click(function (e) {
    e.preventDefault();
    if (sharepanel.is(':visible')) sharepanel.hide();
    else sharepanel.show();
  }).keydown(function (e) {
    console.log(e.which);
    if (e.which == 40) { // down arrow
      e.preventDefault();
      sharepanel.find('a').eq(0).focus();
    }
  });

  var timer;
  $('#gato-share-panel, #gato-share-panel a, [data-gato-share-link]').on('mouseout blur', function () {
    timer = setTimeout(function() { sharepanel.hide() }, 100);
  }).on('mouseover focus', function () {
    clearTimeout(timer);
    sharepanel.show();
  }).keydown(function (e) {
    if (e.which == 27) { // escape
      sharepanel.hide();
    }
  });
});
