jQuery(document).ready(function ($) {
  var items = $('.gato-webtools-items');
  var timeout;
  var show = function () {
    clearTimeout(timeout);
    items.show();
  };
  var hide = function () {
    clearTimeout(timeout);
    timeout = setTimeout(function () { items.hide(); }, 200);
  };
  $('.gato-webtools').mouseover(function (e) {
    show();
  }).mouseout(function (e) {
    hide();
  });
  $('.gato-webtools a').focus(function (e) {
    show();
  }).blur(function (e) {
    hide();
  });
});
