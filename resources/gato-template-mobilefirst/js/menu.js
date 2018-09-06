jQuery(document).ready(function($) {
  var detectAccessibilityClick = function (e) {
    return e.clientX == 0 && e.clientY == 0;
  }
  var $body = $('body');
  var isTouch = false;
  var isTouchTimer;
  var classApplied = false;
  $body.on('touchstart', function () {
    clearTimeout(isTouchTimer);
    isTouch = true;
    isTouchTimer = setTimeout(function () { isTouch = false; }, 100);
    if (classApplied) {
      $body.removeClass('no-touch');
      classApplied = false;
    }
  }).on('mouseover', function () {
    if (!isTouch && !classApplied) {
      $(this).addClass('no-touch');
      classApplied = true;
    }
  });
  /* Main Menu Open and Close */
  var page = $('.page-container');
  var menuButton = $('.btn-menu');
  var menu = $('.main-menu');
  var menuContent = menu.find('.menu-content');
  var header = $('header');
  var menuDynamic = menu.find('.menu-dynamic-navigation');
  var menuUp = menu.find('.navigation-up');

  var animating = 0;
  var complete = function () {
    animating -= 1;
  }
  var menushow = function(accessibilityMode) {
    if (animating) return;
    animating = 3;
    var menuwidth = menu.width();
    var pagewidth = page.width();
    menu.show();
    menuButton.addClass('open');
    menuButton.attr('aria-expanded', true);
    menuContent.velocity({translateX: ['0%', '-100%']}, {duration: 300, complete: complete});
    page.velocity({translateX: [menuwidth+'px', '0px']}, {duration: 300, complete: complete});
    header.velocity({translateX: [menuwidth+'px', '0px'], width: (pagewidth-menuwidth)+'px'}, {duration: 300, complete: complete});
    if (accessibilityMode) menuUp.find('a').eq(0).focus();
  }
  var menuhide = function(accessibilityMode) {
    if (animating) return;
    animating = 3;
    var menuwidth = menu.width();
    var pagewidth = page.width();
    var headerwidth = header.width();
    menuButton.removeClass('open');
    menuButton.attr('aria-expanded', false);
    var hidecomplete = function () {
      complete();
      if (!animating) {
        menu.hide();
        header.css('width', '');
      }
    }
    menuContent.velocity({translateX: ['-100%', '0%']}, {duration: 300, complete: hidecomplete});
    page.velocity({translateX: ['0px', menuwidth+'px']}, {duration: 300, complete: hidecomplete});
    header.velocity({translateX: ['0px', menuwidth+'px'], width: [pagewidth+'px', headerwidth+'px']}, {duration: 300, complete: hidecomplete});
    if (accessibilityMode) menuButton.focus();
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
        var pagewidth = page.width();
        page.css('transform', 'translateX('+menuwidth+'px)');
        header.css('transform', 'translateX('+menuwidth+'px)');
        header.css('width', (pagewidth-menuwidth)+'px');
      }
    });
  }
  $(window).resize(menuresize);

  // menu button, open and close
  menuButton.click(function(e) {
    if (menuButton.hasClass('open')) menuhide(detectAccessibilityClick(e));
    else menushow(detectAccessibilityClick(e));
    e.preventDefault();
  })
  menuButton.keyup(function(e) {
    if (e.which == KeyCodes.DOWN) {
      menushow(true);
      e.preventDefault();
    }
    if (e.which == KeyCodes.UP) {
      menushow(false);
      showmoretools();
      setTimeout(function() {
        menuContent.find('a').eq(-1).focus();
      }, 0);
      e.preventDefault();
    }
  })
  // close menu if they click outside the menu
  $('body > *').on('click', function(e) {
    var targ = $(e.target);
    if (menuButton.hasClass('open') && !targ.closest('#main-menu-toggle').length && !targ.closest('#main-menu').length) {
      e.preventDefault();
      menuhide(false);
    }
  });
  // close menu with the escape key
  $(document).keyup(function (e) {
    if (e.keyCode === KeyCodes.ESCAPE && menuButton.hasClass('open')) {
      e.preventDefault();
      menuhide(true);
    }
  });
  // navigate menu with arrow and letter keys
  var apply_arrowkey_actions = function (container) {
    container.find('a').keydown(function (e) {
      if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;
      var lnk = $(this);
      var lnks = menuContent.find('a:visible');
      var idx = lnks.index(lnk.get(0));
      if (e.which === KeyCodes.UP) {
        lnks.eq(idx-1).focus();
        e.preventDefault();
      } else if (e.which === KeyCodes.DOWN || e.which === KeyCodes.SPACE) {
        lnks.eq((idx+1)%lnks.length).focus();
        e.preventDefault();
      } else if (e.which === KeyCodes.HOME) {
        lnks.eq(0).focus();
        e.preventDefault();
      } else if (e.which === KeyCodes.END) {
        lnks.eq(-1).focus();
        e.preventDefault();
      } else if (e.which >= KeyCodes.A && e.which <= KeyCodes.Z) {
        // rotate through links that begin with the entered letter
        var found = false;
        var findletter = function (slice) {
          lnks.slice(slice).each(function () {
            var l = $(this);
            if (l.text().substring(0,1) === String.fromCharCode(e.which)) {
              l.focus();
              found = true;
              return false; // in jquery this breaks the loop
            }
          });
        }
        findletter(idx+1);
        if (!found) findletter(0);
        e.preventDefault();
      }
    });
  }
  apply_arrowkey_actions(menuContent);

  var moretoolslink = menuContent.find('a.more-tools');
  var moretoolslist = menuContent.find('ul.more-tools');
  var showmoretools = function () {
    moretoolslink.attr('aria-expanded', true);
    moretoolslist.velocity('slideDown', { duration: 300 });
  }

  var hidemoretools = function () {
    moretoolslink.attr('aria-expanded', false);
    moretoolslist.velocity('slideUp', { duration: 300 });
  }

  $('a.more-tools').click(function (e) {
    if (moretoolslink.is('[aria-expanded="true"]')) {
      hidemoretools();
    } else {
      showmoretools();
    }
    e.preventDefault();
  })

  /** Full Site Navigation **/
  gatonavigationdata.isHomePage = true;
  var getnavbypath = function (data) {
    var ret = {};
    ret[data.path] = data;
    for (var i = 0; i < data.children.length; i++) {
      Object.assign(ret, getnavbypath(data.children[i]));
    }
    return ret;
  }
  var navbypath = getnavbypath(gatonavigationdata);

  var generatenavmeta = function (data) {
    var html = '';
    if (data.isHomePage) {
      html +=
      '<a class="home" href="//www.txstate.edu">'+
        '<i class="fa fa-home arrow" aria-hidden="true"></i>'+
        '<span>Home</span>'+
      '</a>';
    } else {
      var parent = navbypath[data.path.split('/').slice(0,-1).join('/')];
      html +=
      '<a class="back" href="'+parent.href+'" data-path="'+parent.path+'">'+
        '<i class="fa fa-angle-left arrow" aria-hidden="true"></i> '+
        '<span>Back</span>'+
      '</a>'+
      '<a class="top" href="'+gatonavigationdata.href+'" data-path="'+gatonavigationdata.path+'">'+
        '<i class="fa fa-angle-left arrow" aria-hidden="true"></i><i class="fa fa-angle-left arrow" aria-hidden="true"></i> '+
        '<span>Main Menu</span>'+
      '</a>';
    }
    return html;
  }

  var generatenavhtml = function (data) {
    var html = '<div class="slide">';
    html += '<div class="navigation-tree">';
    if (!data.isHomePage) html += '<a class="navigation-current" href="'+data.href+'">'+data.title+'</a>';
    html += '<ul class="navigation-children">';
    for (var i = 0; i < data.children.length; i++) {
      var subpage = data.children[i];
      html += '<li><a href="'+subpage.href+'" data-path="'+subpage.path+'">'+
        subpage.title+(subpage.children.length?'<i class="fa fa-angle-right arrow" aria-hidden="true"></i>':'')+
      '</a></li>';
    }
    html += '</ul></div></div>';
    return html;
  }

  var activate_nav_slide = function (e, lnk, infromtheright) {
    if (animating) return;
    var accessibilityMode = detectAccessibilityClick(e);
    var path = lnk.data('path');
    var data = navbypath[path];
    if (data.children.length) {
      animating = 1;
      setTimeout(function () {
        // need to do this after all the other work finishes or the menu will close
        menuUp.html(generatenavmeta(data));
        apply_up_actions();
      }, 0);
      var oldslide = menuDynamic.find('.slide');
      var oldheight = menuDynamic.height();
      lnk.blur();
      var slide = $(generatenavhtml(data));
      menuDynamic.append(slide);
      slide.css({position: 'absolute', left: '0', top: '0', width: '100%'});
      var newheight = slide.height();
      if (newheight > oldheight) {
        menuDynamic.velocity({height: [newheight+'px',oldheight+'px']}, {duration: 300});
      } else {
        menuDynamic.css('height', oldheight+'px');
      }

      var newslidepos = ['0%', '100%'], oldslidepos = ['-100%', '0%'];
      if (!infromtheright) {
        newslidepos = ['0%','-100%'];
        oldslidepos = ['100%','0%'];
      }
      slide.velocity({translateX: newslidepos}, {duration: 300});
      oldslide.velocity({translateX: oldslidepos}, {duration: 300, complete: function() {
        oldslide.remove();
        apply_actions(slide);
        animating = 0;
        if (accessibilityMode && lnk.not('.back,.top')) slide.find('a').eq(0).focus();
      }});
      e.preventDefault();
    }
  }

  var apply_actions = function (slide) {
    slide.find('.navigation-children a').click(function (e) {
      activate_nav_slide(e, $(this), true);
    });
    apply_arrowkey_actions(slide);
  }
  apply_actions(menuDynamic.find('.slide'));

  var apply_up_actions = function () {
    menuUp.find('.back, .top').click(function (e) {
      activate_nav_slide(e, $(this), false);
    });
    apply_arrowkey_actions(menuUp);
  }
  apply_up_actions();
});
