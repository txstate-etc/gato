jQuery(document).ready(function($) {
  $('.flexible .flex-row .content-item a.flexible-card-link').focus(function() {
    $(this).parent().addClass('focused')
  })
  $('.flexible .flex-row .content-item a.flexible-card-link').blur(function() {
    $(this).parent().removeClass('focused')
  })
})