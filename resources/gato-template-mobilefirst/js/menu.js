jQuery(document).ready(function($) {
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
  var panel = $('#panel');

  var animating = 0;
  var complete = function () {
    animating -= 1;
  }
  var menushow = function() {
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
  }
  var menuhide = function() {
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
        panel.css('transform', '');
      }
    }
    menuContent.velocity({translateX: ['-100%', '0%']}, {duration: 300, complete: hidecomplete});
    page.velocity({translateX: ['0px', menuwidth+'px']}, {duration: 300, complete: hidecomplete});
    header.velocity({translateX: ['0px', menuwidth+'px'], width: [pagewidth+'px', headerwidth+'px']}, {duration: 300, complete: hidecomplete});
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
    if (menuButton.hasClass('open')) menuhide();
    else {
      menushow();
      menuUp.find('a').eq(0).focus();
    }

    e.preventDefault();
  })
  menuButton.keyup(function(e) {
    if (e.which == KeyCodes.DOWN) {
      menushow(true);
      menuUp.find('a').eq(0).focus();
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
  $('body > *').on('click focusin', function(e) {
    var targ = $(e.target);
    if (menuButton.hasClass('open') && !targ.closest('#main-menu-toggle').length && !targ.closest('#main-menu').length) {
      if (e.type == 'click') e.preventDefault();
      menuhide();
    }
  });
  // close menu with the escape key
  // navigate menu with arrow and letter keys
  $(document).keydown(function (e) {
    if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;
    if (e.keyCode === KeyCodes.ESCAPE && menuButton.hasClass('open')) {
      e.preventDefault();
      menuhide(true);
      menuButton.focus();
      return;
    }
    var targ = $(e.target);
    if (targ.is('#main-menu *')) {
      var lnks = menuContent.find('a:visible,.invisible-focus');
      if (e.which == KeyCodes.HOME) {
        lnks.eq(0).focus();
        e.preventDefault();
      } else if (e.which === KeyCodes.END) {
        lnks.eq(-1).focus();
        e.preventDefault();
      } else if (e.which === KeyCodes.UP) {
        var idx = lnks.index(targ.get(0))-1;
        while (idx >= 0 && !lnks.eq(idx).is('a')) {
          idx -= 1;
        }
        lnks.eq(idx).focus();
        e.preventDefault();
      } else if (e.which === KeyCodes.DOWN || e.which === KeyCodes.SPACE) {
        var idx = lnks.index(targ.get(0))+1;
        while (idx < lnks.length && !lnks.eq(idx).is('a')) {
          idx += 1;
        }
        var down = idx < lnks.length ? lnks.eq(idx) : lnks.eq(0);
        down.focus();
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
        findletter(idxs.down);
        if (!found) findletter(0);
        e.preventDefault();
      }
    }
  });



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
    html += '<div class="invisible-focus" tabindex="-1"></div>';
    html += '<div class="navigation-tree">';
    if (!data.isHomePage) html += '<a class="navigation-current" href="'+data.href+'">'+data.title+'</a>';
    html += '<ul class="navigation-children">';
    for (var i = 0; i < Math.min(data.children.length, 8); i++) {
      var subpage = data.children[i];
      html += '<li><a href="'+subpage.href+'" data-path="'+subpage.path+'"'+'data-depth="'+ subpage.depth +'">'+
        subpage.title+((subpage.children.length && subpage.depth < 5)?'<i class="fa fa-angle-right arrow" aria-hidden="true"></i>':'')+
      '</a></li>';
    }
    html += '</ul></div></div>';
    return html;
  }

  var activate_nav_slide = function (e, lnk, infromtheright) {
    var path = lnk.data('path');
    var depth = lnk.data('depth');
    var data = navbypath[path];
    if (data.children.length && (depth < 5 || !infromtheright)) {
      e.preventDefault();
      if (animating) return;
      animating = 1;
      setTimeout(function () {
        // need to do this after all the other work finishes or the menu will close
        menuUp.html(generatenavmeta(data));
        apply_up_actions();
        if (lnk.is('.back,.top')) menuUp.find('a').eq(0).focus();
      }, 0);
      var oldslide = menuDynamic.find('.slide');
      var oldheight = menuDynamic.height();
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
      }});
      if (!lnk.is('.back,.top')) { slide.find('.invisible-focus').focus(); }
    }
  }

  var apply_actions = function (slide) {
    slide.find('.navigation-children a').click(function (e) {
      activate_nav_slide(e, $(this), true);
    });
  }
  apply_actions(menuDynamic.find('.slide'));

  var apply_up_actions = function () {
    menuUp.find('.back, .top').click(function (e) {
      activate_nav_slide(e, $(this), false);
    });
  }
  apply_up_actions();

  //hide separator if there are no buttons
  if ($('#main-menu .multilinks li').length == 0) $('.super-list.first').addClass('no-buttons');
});
