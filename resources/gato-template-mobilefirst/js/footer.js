jQuery(document).ready(function($) {

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
  
});