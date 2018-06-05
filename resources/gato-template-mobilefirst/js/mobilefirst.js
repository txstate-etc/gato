jQuery(document).ready(function($) {
  $('.footer-column-title').click(function(e) {
    e.preventDefault();
    var container = $(this).parent();
    container.toggleClass('expanded')
    $(this).attr('aria-expanded', !container.hasClass('collapsed'))
  })
});
