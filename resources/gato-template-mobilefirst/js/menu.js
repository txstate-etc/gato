jQuery(document).ready(function($) {
  /* Main Menu Open and Close */
  var page = $('.content-wrap');
  var menuButton = $('.btn-menu');
  var menu = $('.main-menu');
  var menuContent = $('.main-menu .menu-content');
  var body = $('body');
  var pageContainer = $('.page-container');
  //
  var menushow = function() {
    menu.velocity({translateX: ['0%','-100%']}, {duration: "300ms"})
    page.velocity({translateX: ['300px', '0px']}, {duration: "300ms"})
    pageContainer.addClass('menuOut');
    menuButton.find('i').toggleClass('fa-bars fa-times');
    menuButton.attr('aria-expanded', true);
    menuButton.attr('aria-label', "Close main menu");
    body.css('overflow', "hidden");
  }
  var menuhide = function() {
    menu.velocity({translateX: ['-100%','0%']}, {duration: "300ms"})
    page.velocity({translateX: ['0px', '300px']}, {duration: "300ms"})
    pageContainer.removeClass('menuOut');
    menuButton.find('i').toggleClass('fa-bars fa-times');
    menuButton.attr('aria-expanded', false);
    menuButton.attr('aria-label', "Open main menu");
    body.css('overflow', "visible");
  }
  //
  menuButton.click(function(e) {
    if (pageContainer.hasClass('menuOut')) menuhide();
    else menushow();
  })
  $(document).on('click', function(e) {
    var targ = $(e.target);
    if (pageContainer.is('.menuOut') && !targ.is('.btn-menu, .btn-menu .fa, .btn-menu .label') && !targ.closest('#main-menu').length) {
      e.preventDefault();
      menuhide();
    }
  });
  // close the menu with the escape key
  $(document).keyup(function (e) {
    if (e.keyCode === 27 && pageContainer.hasClass('menuOut')) {
      e.preventDefault();
      menuhide();
    }
  });
});
