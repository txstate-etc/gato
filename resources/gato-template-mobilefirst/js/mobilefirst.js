jQuery(document).ready(function($) {
  var header = $('header');
  $(window).scroll(function(){
    if (header.offset().top > 0) {
      header.addClass('scrolled');
    }
    else {
      header.removeClass('scrolled');
    }
  })

  $('.footer-column-title').click(function(e) {
    e.preventDefault();
    var container = $(this).parent();
    container.toggleClass('expanded')
    $(this).attr('aria-expanded', !container.hasClass('collapsed'))
  })
});
