jQuery(document).ready(function($) {
  if ($('[data-gato-share-link]').length == 0) return;

  $('body').append('<div id="gato-share-panel">'+
  '<a class="facebook" href="" target="_blank"><i class="fa fa-facebook-square"><span class="visuallyhidden">Share on Facebook</span></i></a>'+
  '<a class="twitter" href="" target="_blank"><i class="fa fa-twitter"><span class="visuallyhidden">Share on Twitter</span></i></a>'+
  '<a class="email" href=""><i class="fa fa-envelope"><span class="visuallyhidden">Share by E-Mail</span></i></a>'+
  '</div>');
  var sharepanel = $('#gato-share-panel');
  var $lnk;
  $('[data-gato-share-link]').attr('aria-label', "share link, press down for options");

  $('#gato-share-panel a:not(.email)').click(function (e) {
    e.preventDefault();
    var size = {
      width: 500,
      height: 500
    };
    var loc = {
        left:  (window.screen.availLeft + (window.screen.availWidth / 2)) - (size.width / 2),
        top: (window.screen.availTop + (window.screen.availHeight / 2)) - (size.height / 2)
    };
    window.open($(this).attr('href'), 'sharelink', 'menubar=no,status=no,titlebar=no,location=no,toolbar=no,width='+size.width+',height='+size.height+',resizable=yes,left='+loc.left+',top='+loc.top);
  });

  $('[data-gato-share-link]').on('mouseover focus click', function() {
    $lnk = $(this);
    sharepanel.find('.twitter').attr('href',
      'http://twitter.com/intent/tweet?text='+encodeURIComponent($lnk.data('gato-share-text'))+
      '&url='+encodeURIComponent($lnk.data('gato-share-link')));
    sharepanel.find('.facebook').attr('href',
      'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent($lnk.data('gato-share-link')));
    sharepanel.find('.email').attr('href',
      'mailto:?subject='+encodeURIComponent($lnk.data('gato-share-subject'))+'&body='+encodeURIComponent($lnk.data('gato-share-text'))+encodeURIComponent("\r\n\r\n")+encodeURIComponent($lnk.data('gato-share-link')));
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
    console.log(e.which);
    if (e.which == 27) { // escape
      sharepanel.hide();
    }
  });

  $('#gato-share-panel a').keydown(function (e) {
    if (e.which == 37) // left arrow
      $(this).prev('a').focus();
    if (e.which == 38) // up arrow
      if ($(this).prev('a').length > 0)
        $(this).prev('a').focus();
      else
        $lnk.focus();
    if (e.which == 39) // right arrow
      $(this).next('a').focus();
    if (e.which == 40) // down arrow
      $(this).next('a').focus();
    e.preventDefault();
  })
  $('#gato-share-panel a').eq(-1).keydown(function (e) {
    if (e.which == 9) // tab
      $lnk.focus();
  });
});
