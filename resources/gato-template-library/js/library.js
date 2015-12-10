jQuery(document).ready(function ($) {
  // this line is duplicated in txstate2015's common.js
  // probably need a refactoring since the templates share a header but nothing else
  $('.more-tools > a').hovermenu('.super-list-sub');

    // Fixed desktop navigation
    $('.top_nav').scrollToFixed();
});
