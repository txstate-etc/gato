jQuery(document).ready(function($) {

  magnolialabelchange('.menubar .menu', '.mgnlEditor.mgnlPlaceholder', 'Add Header Links');
  magnolialabelchange('.multilinks .editMultiLinks', '.mgnlEditor.mgnlEditorBar', 'Header Links');
  magnolialabelchange('.addBannerImage', '.mgnlEditor.mgnlPlaceholder', 'Edit Banner Image');
  magnolialabelchange('.contact-info', '.mgnlEditor.mgnlPlaceholder', 'Add Contact Information');
  magnolialabelchange('.organization-info .addParentOrg', '.mgnlEditor.mgnlPlaceholder', "Add Parent Organization");
  magnolialabelchange('.mobilefirst_component_add', '.mgnlEditor.mgnlPlaceholder', "Add Section");
  magnolialabelchange('.footer-column.center .footer-column-title', '.mgnlEditor.mgnlPlaceholder', 'Customize Title for Links');
  magnolialabelchange('.footer-column.right .add-links-title', '.mgnlEditor.mgnlPlaceholder', 'Add Title for Links');

  /* Header Animation */
  var header = $('header');
  var banner = $('.banner-section');
  var menubar = $('.menubar');
  var logoblock = $('.logo-block');
  var searchButton = $('.btn-search');
  var orgInfo = $('body:not(.admin) .organization-info.no-image');
  var headerBars = $('body:not(.admin) .header-bars');
  var animationDuration = 300

  //set this variable for the anchor scroll fix
  window.stickynavheight = $('.menubar').height();

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

     orgInfo.velocity({translateY: "-120px"}, {duration: animationDuration});
     headerBars.velocity({translateY: "-120px"}, {duration: animationDuration});

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

      orgInfo.velocity({translateY: "0px"}, {duration: animationDuration});
      headerBars.velocity({translateY: "0px"}, {duration: animationDuration});

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
    orgInfo.velocity("stop")
    headerBars.velocity("stop")
    header.removeClass('animatetotop').removeClass('animatetoscroll')
  }

  $(window).scroll(function(e) {
    var scrolltop = $(window).scrollTop();
    if (scrolltop > 40 ) {
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

  /* Footer drop down menus (mobile view only) */
  var animating = 0;
  $('.mobile-footer-column-title').click(function(e) {
    e.preventDefault();
    if (animating) return;
    animating = 1;
    var container = $(this).parent();
    var title = $(this);
    var list = container.find('.footer-column-link-list');
    if (container.is('.expanded')) {
      list.velocity("slideUp", {duration: 300, complete: function() {
        container.removeClass('expanded')
        title.attr('aria-expanded', false);
        animating = 0;
      }})
    }
    else {
      list.velocity("slideDown", { duration: 300, complete: function() {
        container.addClass('expanded')
        title.attr('aria-expanded', true);
        animating = 0;
      } })
    }
  })

  //Velocity will hide the footer links on mobile by adding an inline
  //display:none. This also hides the links on larger screens, when they should
  //always be visible. This function makes sure that the links are visible on desktop.
  var checkFooterLinkDisplay = function() {
    if (window.matchMedia && !window.matchMedia("(max-width: 50em)").matches) {
      $('.footer-column-link-list').show();
    }
    //fallback for IE 9
    if (!window.matchMedia) {
      if ($(window).width() > 799) {
        $('.footer-column-link-list').show();
      }
    }
  }
  resizeTimeout(checkFooterLinkDisplay);

  //fix spacing in layout content types with no title or background color
  // $('.gato-section-full:not(.has-background)').each(function() {
  //   var section = $(this);
  //   if (section.find('.section-title').length == 0) {
  //     section.find('.layout-column').each(function() {
  //       $(this).addClass('add-space')
  //     })
  //   }
  // })

  $(document).ready(function() {
    var $patternImages = $('.mobilefirst-pattern .pattern-image img')
    objectFitImages($patternImages);
  });
});
