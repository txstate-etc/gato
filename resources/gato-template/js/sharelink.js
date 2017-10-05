jQuery(document).ready(function($) {
  $('body').after('<div id="gato-share-panel">'+
  '<a class="facebook" href="" target="_blank"><i class="fa fa-facebook-square"><span class="visuallyhidden">Share on Facebook</span></i></a>'+
  '<a class="twitter" href="" target="_blank"><i class="fa fa-twitter"><span class="visuallyhidden">Share on Twitter</span></i></a>'+
  '</div>');
  var sharepanel = $('#gato-share-panel');
  var $lnk;
  $('[data-gato-share-link]').on('mouseover focus click', function() {
    $lnk = $(this);
    sharepanel.find('.twitter').attr('href',
      'http://twitter.com/intent/tweet?text='+encodeURIComponent($lnk.data('gato-share-text'))+
      '&url='+encodeURIComponent($lnk.data('gato-share-link')));
    sharepanel.find('.facebook').attr('href',
      'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent($lnk.data('gato-share-link')));
    sharepanel.css({left: ($lnk.offset().left+25)+'px', top: ($lnk.offset().top-sharepanel.outerHeight()-5)+'px'});
  }).click(function (e) {
    e.preventDefault();
    if (sharepanel.is(':visible')) sharepanel.hide();
    else sharepanel.show();
  }).keydown(function (e) {
    if (e.which == 40) { // down arrow
      e.preventDefault();
      sharepanel.find('a').eq(0).focus();
    }
  });

  var timer;
  $('#gato-share-panel, #gato-share-panel a, [data-gato-share-link]').on('mouseout blur', function () {
    clearTimeout(timer);
    timer = setTimeout(function() { sharepanel.hide() }, 150);
  }).on('mouseover focus', function () {
    clearTimeout(timer);
    sharepanel.show();
  }).keydown(function (e) {
    if (e.which == 27) { // escape
      sharepanel.hide();
    }
  });
});
