jQuery(document).ready(function($) {
  /* Main Menu Open and Close */
  var page = $('.page-container');
  var menuButton = $('.btn-menu');
  var menu = $('.main-menu');
  var menuContent = menu.find('.menu-content');
  var header = $('header');

  var animating = 0;
  var complete = function () {
    animating -= 1;
  }
  var menushow = function() {
    if (animating) return;
    animating = 3;
    var menuwidth = menu.width();
    menu.show();
    menuButton.addClass('open');
    menuButton.attr('aria-expanded', true);
    menuContent.velocity({translateX: ['0%', '-100%']}, {duration: 300, complete: complete});
    page.velocity({translateX: [menuwidth+'px', '0px']}, {duration: 300, complete: complete});
    header.velocity({translateX: [menuwidth+'px', '0px']}, {duration: 300, complete: complete});
  }
  var menuhide = function() {
    if (animating) return;
    animating = 3;
    var menuwidth = menu.width();
    menuButton.removeClass('open');
    menuButton.attr('aria-expanded', false);
    var hidecomplete = function () {
      complete();
      if (!animating) menu.hide();
    }
    menuContent.velocity({translateX: ['-100%', '0%']}, {duration: 300, complete: hidecomplete});
    page.velocity({translateX: ['0px', menuwidth+'px']}, {duration: 300, complete: hidecomplete});
    header.velocity({translateX: ['0px', menuwidth+'px']}, {duration: 300, complete: hidecomplete});
  }

  // be prepared for the menu to change width on resize since we set a max-width
  // for very small screens
  var resizetimer;
  var menuresize = function () {
    cancelanimationframe(resizetimer);
    if (animating) resizetimer = animationframe(menuresize);
    else resizetimer = animationframe(function () {
      if (menuButton.hasClass('open')) {
        var menuwidth = menu.width();
        page.css('transform', 'translateX('+menuwidth+'px)');
        header.css('transform', 'translateX('+menuwidth+'px)');
      }
    });
  }
  $(window).resize(menuresize);

  // menu button, open and close
  menuButton.click(function(e) {
    if (menuButton.hasClass('open')) menuhide();
    else menushow();
  })
  // close menu if they click outside the menu
  $(document).on('click', function(e) {
    var targ = $(e.target);
    if (menuButton.hasClass('open') && !targ.is('.btn-menu, .btn-menu .fa, .btn-menu .label') && !targ.closest('#main-menu').length) {
      e.preventDefault();
      menuhide();
    }
  });
  // close menu with the escape key
  $(document).keyup(function (e) {
    if (e.keyCode === 27 && menuButton.hasClass('open')) {
      e.preventDefault();
      menuhide();
    }
  });
});
