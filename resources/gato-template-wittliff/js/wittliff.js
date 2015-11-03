jQuery(document).ready(function ($) {
  $('#mainnav li.submenu').each(function (i, menu) {
    menu = $(menu);
    var timeout;
    var show = function () {
      clearTimeout(timeout);
      $('#mainnav li.submenu').removeClass('active');
      menu.addClass('active');
    };
    var hide = function () {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        menu.removeClass('active');
      }, 100);
    };
    menu.find('a').on('focus mouseover', function (e) {
      show();
    }).on('blur mouseout', function (e) {
      hide();
    })
  });
});
