jQuery(document).ready(function($) {
  var menucontainer = $('.main-menu');
  var menubtn = $('.main-menu >button');
  var menupanel = $('.main-menu .main-menu-panel');
  menubtn.click(function (e) {
    menucontainer.toggleClass('shown');
  })
  $('html').click( function (e) {
    if (!$.contains(menucontainer.get(0), e.target)) {
      menucontainer.removeClass('shown');
    }
  });
});
