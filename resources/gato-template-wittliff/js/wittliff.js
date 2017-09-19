jQuery(document).ready(function($) {
  // Editing environment text changes
  magnolialabelchange('.menu-social-media', '.mgnlEditor.mgnlPlaceholder', 'Add Social Media');
  magnolialabelchange('.menu-newsletter-button', '.mgnlEditor.mgnlPlaceholder', 'Add Newsletter Button');
  magnolialabelchange('.menu-donate-button', '.mgnlEditor.mgnlPlaceholder', 'Add Donate Button');

  // Main Menu Hamburger Button
  var header = $('.page-header');
  var menucontainer = $('.main-menu');
  var menubtn = $('.main-menu >button');
  var menupanel = $('.main-menu .main-menu-panel');
  var menuhide = function () {
    header.removeClass('menu-out');
    menubtn.attr('aria-expanded', false);
    menupanel.velocity('slideUp', { duration: 150 });
  }
  var menushow = function() {
    header.addClass('menu-out');
    menubtn.attr('aria-expanded', true);
    menupanel.velocity('slideDown', { duration: 150 });
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
    if (e.keyCode === 27 && header.hasClass('menu-out')) {
      e.preventDefault();
      menuhide();
    }
  });

  // Main Menu expand/contract
  $('.simplemenu-expand').click(function (e) {
    var btn = $(this);
    var toplevel = btn.closest('li');
    var panel = toplevel.find('.simplemenu-subitems');
    toplevel.toggleClass('expanded');
    btn.attr('aria-expanded', toplevel.hasClass('expanded'));
    panel.velocity(toplevel.hasClass('expanded') ? 'slideDown' : 'slideUp', { duration: 150 });
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
  var smcancel = function() {
    if (smcontainer.hasClass('shown')) {
      clearTimeout(smtimeout);
    }
  }
  smbtn.mouseover(smin);
  smpanel.mouseover(smin);
  header.mouseover(smcancel);
  header.mouseout(smout);
  smpanel.mouseout(smout);
  $('html').click( function (e) {
    if (!$.contains(smcontainer.get(0), e.target)) {
      smcontainer.removeClass('shown');
      smbtn.attr('aria-expanded', false);
    }
  });

  // Make sure the footer is at the bottom of the window when the
  // page is shorter than one window
  var win = $(window);
  var header = $('.page-header');
  var footer = $('.page-footer');
  var pagecontent = $('.page_content');
  var pagecontentheightfix = function () {
    pagecontent.css('min-height', win.height() - header.outerHeight(true) - footer.outerHeight(true) - pagecontent.outerHeight(true) + pagecontent.outerHeight());
  }
  resizeTimeout(pagecontentheightfix);
  waitforselector('.navBlocks_add', '.mgnlEditor.mgnlPlaceholder', pagecontentheightfix);
});
