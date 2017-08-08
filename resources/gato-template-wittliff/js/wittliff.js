jQuery(document).ready(function($) {

  // Main Menu Hamburger Button
  var header = $('.page-header');
  var menucontainer = $('.main-menu');
  var menubtn = $('.main-menu >button');
  var menupanel = $('.main-menu .main-menu-panel');
  var menuhide = function () {
    header.removeClass('menu-out');
    menubtn.attr('aria-expanded', false);
  }
  var menushow = function() {
    header.addClass('menu-out');
    menubtn.attr('aria-expanded', true);
  }
  menubtn.click(function (e) {
    if (header.hasClass('menu-out')) menuhide();
    else menushow();
  })
  $('html').click( function (e) {
    if (!$.contains(menucontainer.get(0), e.target)) {
      menuhide();
    }
  });
  // close the menu with the escape key
  $(document).keyup(function (e) {
    if (e.keyCode === 27 && menucontainer.hasClass('shown')) {
      e.preventDefault();
      menuhide();
    }
  });

  // Main Menu expand/contract
  $('.simplemenu-expand').click(function (e) {
    var btn = $(this);
    var toplevel = btn.closest('li');
    toplevel.toggleClass('expanded');
    btn.attr('aria-expanded', toplevel.hasClass('expanded'));
  });


  // Stay Connected Button
  var smcontainer = $('.social-media');
  var smbtn = $('.social-media >button');
  var smpanel = $('.social-media .social-media-panel');
  var smtimeout;
  smbtn.click(function (e) {
    smcontainer.toggleClass('shown');
    smbtn.attr('aria-expanded', smcontainer.is('.shown'));
  })
  var smin = function() {
    clearTimeout(smtimeout);
    smtimeout = setTimeout(function() {
      smcontainer.addClass('shown');
      smbtn.attr('aria-expanded', true);
    }, 100);
  }
  var smout = function() {
    clearTimeout(smtimeout);
    smtimeout = setTimeout(function() {
      smcontainer.removeClass('shown');
      smbtn.attr('aria-expanded', false);
    }, 200);
  }
  smbtn.mouseover(smin);
  smpanel.mouseover(smin);
  smbtn.mouseout(smout);
  smpanel.mouseout(smout);
  $('html').click( function (e) {
    if (!$.contains(smcontainer.get(0), e.target)) {
      smcontainer.removeClass('shown');
    }
  });
});
