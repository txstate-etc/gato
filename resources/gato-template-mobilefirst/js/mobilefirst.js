jQuery(document).ready(function($) {

  magnolialabelchange('.addBannerImage', '.mgnlEditor.mgnlPlaceholder', 'Add Banner Image');
  magnolialabelchange('.contact-info', '.mgnlEditor.mgnlPlaceholder', 'Add Contact Information');

  function animateHeader() {
    var header = $('header');
    var banner = $('.banner-section');
    var menubar = $('.menubar');
    var logoblock = $('.logo-block');
    var searchButton = $('.btn-search')
    var animationDuration = 300
    if (header.offset().top > 0 ) {
      banner.addClass('scrolled');
      if (!searchButton.is('.scrolled') && !searchButton.is('.velocity-animating'))
        searchButton.velocity({left: [60, 0], top: [0, 60]}, {duration: animationDuration, complete: function(){
          searchButton.addClass('scrolled')
        }})
      if(!logoblock.is('.scrolled') && !logoblock.is('.velocity-animating'))
        logoblock.velocity({top: [-120, 0]}, {duration: animationDuration, complete: function(){
          logoblock.addClass('scrolled')
        }})
      if (!menubar.is('.scrolled') && !menubar.is('.velocity-animating'))
        menubar.velocity({top: [0, -60]}, {duration: animationDuration, begin: function(){
          menubar.addClass('scrolled')
        }})
    }
    else {
      banner.removeClass('scrolled');
      if (searchButton.is('.scrolled') && !searchButton.is('.velocity-animating'))
        searchButton.velocity({left: [0, 60], top: [60, 0]}, {duration: animationDuration, complete: function(){
          searchButton.removeClass('scrolled')
        }})
      if (logoblock.is('.scrolled') && !logoblock.is('.velocity-animating')){
        logoblock.velocity({top: [0, -120]}, {duration: animationDuration, begin: function(){
          logoblock.removeClass('scrolled')
        }})
      }
      if (menubar.is('.scrolled') && !menubar.is('.velocity-animating')) {
        menubar.velocity({top: [-60, 0]}, {duration: animationDuration, complete: function() {
          menubar.removeClass('scrolled')
        }})
      }

    }
  }

  $(window).scroll(animateHeader)

  $('.footer-column-title').click(function(e) {
    e.preventDefault();
    var container = $(this).parent();
    container.toggleClass('expanded')
    $(this).attr('aria-expanded', !container.hasClass('collapsed'))
  })
});
