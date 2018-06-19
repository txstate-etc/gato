jQuery(document).ready(function($) {

  magnolialabelchange('.menubar .menu', '.mgnlEditor.mgnlPlaceholder', 'Add Links');
  magnolialabelchange('.addBannerImage', '.mgnlEditor.mgnlPlaceholder', 'Add Banner Image');
  magnolialabelchange('.contact-info', '.mgnlEditor.mgnlPlaceholder', 'Add Contact Information');
  magnolialabelchange('.fullwidth .content_add', '.mgnlEditor.mgnlPlaceholder', 'Add Content');
  magnolialabelchange('.fullwidth .image_add', '.mgnlEditor.mgnlPlaceholder', 'Add Image');

  var header = $('header');
  var banner = $('.banner-section');
  var menubar = $('.menubar');
  var logoblock = $('.logo-block');
  var searchButton = $('.btn-search')
  var animationDuration = 300

  function goToScrollState() {
    //search button to top, logo block up, menubar down
    searchButton.velocity({translateX: "60px", translateY: "-60px"},
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

  $('.footer-column-title').click(function(e) {
    e.preventDefault();
    var container = $(this).parent();
    container.toggleClass('expanded')
    $(this).attr('aria-expanded', !container.hasClass('collapsed'))
  })
});
