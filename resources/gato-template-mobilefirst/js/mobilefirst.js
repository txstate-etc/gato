jQuery(document).ready(function($) {

  magnolialabelchange('.menubar .menu', '.mgnlEditor.mgnlPlaceholder', 'Add Links');
  magnolialabelchange('.addBannerImage', '.mgnlEditor.mgnlPlaceholder', 'Edit Banner Image');
  magnolialabelchange('.contact-info', '.mgnlEditor.mgnlPlaceholder', 'Add Contact Information');
  magnolialabelchange('.fullwidth .content_add', '.mgnlEditor.mgnlPlaceholder', 'Add Content');
  magnolialabelchange('.fullwidth .image_add', '.mgnlEditor.mgnlPlaceholder', 'Add Image');

  /* Header Animation */
  var header = $('header');
  var banner = $('.banner-section');
  var menubar = $('.menubar');
  var logoblock = $('.logo-block');
  var searchButton = $('.btn-search')
  var animationDuration = 300

  function goToScrollState() {
    //search button to top, logo block up, menubar down
    searchButton.velocity({translateX: "60px", translateY: "-63px"},
     {duration: animationDuration,
     begin: function(){
       header.addClass("animatetoscroll")
     },
     complete: function() {
       header.removeClass("animatetoscroll")
     }})

     logoblock.velocity({translateY: "-120px"},
      {duration: animationDuration,
       complete: function() {
         logoblock.css('display', 'none')
       }})

     menubar.velocity({translateY: "60px"},
      {duration: animationDuration,
       begin: function() {
         menubar.css('display', 'block')
       }})
  }

  function goToTopState() {
    //search button to side, logo block down, menubar up
      searchButton.velocity({translateX: "0px", translateY: "0px"},
        {duration: animationDuration,
         begin: function() {
           header.addClass("animatetotop")
         },
         complete: function() {
           header.removeClass('animatetotop')
         }})

      logoblock.velocity({translateY: "0px"},
        {duration: animationDuration,
         begin: function() {
           logoblock.css('display', 'flex')
         }})

       menubar.velocity({translateY: "0px"},
        {duration: animationDuration,
         complete: function() {
           menubar.css('display', 'none')
         }})
  }

  function stopHeaderAnimation() {
    searchButton.velocity("stop")
    logoblock.velocity("stop")
    menubar.velocity("stop")
    header.removeClass('animatetotop').removeClass('animatetoscroll')
  }

  $(window).scroll(function() {
    if (header.offset().top > 0 ) {
      banner.addClass('scrolled');
      if (header.is('.animatetotop')) {
        stopHeaderAnimation();
      }
      if (!header.is('.scrolled')) {
        goToScrollState()
        header.addClass('scrolled')
      }
    }
    else {
      banner.removeClass('scrolled');
      if (header.is('.animatetoscroll')) {
        stopHeaderAnimation();
      }
      if (header.is('.scrolled')) {
        goToTopState()
        header.removeClass('scrolled')
      }
    }
  })

  /* Main Menu Open and Close */
  var page = $('.content-wrap');
  var menuButton = $('.btn-menu');
  var menu = $('.main-menu');
  var menuContent = $('.main-menu .menu-content');
  var body = $('body');
  var pageContainer = $('.page-container');
  //
  var menushow = function() {
    menu.velocity({width: "300px"}, {duration: "300ms"})
    page.velocity({translateX: "300px"}, {duration: "300ms"})
    pageContainer.addClass('menuOut');
    menuButton.find('i').toggleClass('fa-bars fa-times');
    menuButton.attr('aria-expanded', true);
    menuButton.attr('aria-label', "Close main menu");
    menu.attr('aria-expanded', true);
    body.css('overflow', "hidden");
  }
  var menuhide = function() {

    menu.velocity({width: "0px"}, {duration: "300ms"})
    page.velocity({translateX: "0px"}, {duration: "300ms"})
    pageContainer.removeClass('menuOut');
    menuButton.find('i').toggleClass('fa-bars fa-times');
    menuButton.attr('aria-expanded', false);
    menuButton.attr('aria-label', "Open main menu");
    menu.attr('aria-expanded', true);
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

  /* Footer drop down menus (mobile view only) */
  $('.mobile-footer-column-title').click(function(e) {
    e.preventDefault();
    var container = $(this).parent();
    var title = $(this);
    var list = container.find('.footer-column-link-list');
    if (container.is('.expanded')) {
      list.velocity("slideUp", {duration: 300, complete: function() {
        container.removeClass('expanded')
        title.attr('aria-expanded', false);
      }})
    }
    else {
      list.velocity("slideDown", { duration: 300, begin: function() {
        container.addClass('expanded')
        title.attr('aria-expanded', true);
      } })
    }
  })
});
