jQuery(document).ready(function($) {
  /* Main Menu Open and Close */
  var page = $('.page-container');
  var menuButton = $('.btn-menu');
  var menu = $('.main-menu');
  var menuContent = menu.find('.menu-content');
  var header = $('header');
  var menuDynamic = menu.find('.menu-dynamic-navigation');

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

  $('a.more-tools').click(function (e) {
    var lnk = $(this);
    var list = $('ul.more-tools');
    if (lnk.is('[aria-expanded="true"]')) {
      lnk.attr('aria-expanded', false);
      list.velocity('slideUp', { duration: 300 });
    } else {
      lnk.attr('aria-expanded', true);
      list.velocity('slideDown', { duration: 300 });
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

  var generatenavhtml = function (data) {
    var html = '<div class="slide">';
    if (!data.isHomePage) {
      var parent = navbypath[data.path.split('/').slice(0,-1).join('/')];
      html += '<div class="navigation-up">'+
        '<a class="back" href="'+parent.href+'" data-path="'+parent.path+'">'+
        '<i class="fa fa-angle-left arrow" aria-hidden="true"></i> '+
        '<span>Back</span>'+
      '</a>'+
      '<a class="top" href="'+gatonavigationdata.href+'" data-path="'+gatonavigationdata.path+'">'+
        '<i class="fa fa-angle-double-left arrow" aria-hidden="true"></i> '+
        '<span>Main Menu</span>'+
      '</a>'+
      '</div>';
    }
    html += '<div class="navigation-tree">'+
      '<a class="navigation-current" href="'+data.href+'">'+data.title+'</a>'+
      '<ul class="navigation-children">';
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
    var path = lnk.data('path');
    var data = navbypath[path];
    if (data.children.length) {
      var slide = $(generatenavhtml(data));
      var oldslide = menuDynamic.find('.slide');
      menuDynamic.append(slide);
      slide.css({position: 'absolute', left: '0', top: '0', width: '100%'});

      var newslidepos = ['0%', '100%'], oldslidepos = ['-100%', '0%'];
      if (!infromtheright) {
        newslidepos = ['0%','-100%'];
        oldslidepos = ['100%','0%'];
      }
      slide.velocity({translateX: newslidepos}, {duration: 300});
      oldslide.velocity({translateX: oldslidepos}, {duration: 300, complete: function() {
        oldslide.remove();
        apply_actions(slide);
      }});
      menuDynamic.velocity({height: [slide.height()+'px',oldslide.height()+'px']}, {duration: 300});
      e.preventDefault();
    }
  }

  var apply_actions = function (slide) {
    slide.find('.navigation-children a').click(function (e) {
      activate_nav_slide(e, $(this), true);
    });
    slide.find('.navigation-up .back, .navigation-up .top').click(function (e) {
      activate_nav_slide(e, $(this), false);
    });
  }
  apply_actions(menuDynamic.find('.slide'));
});
