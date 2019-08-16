jQuery(document).ready(function($) {
  console.log($('.simplemenu li a.active').length)
  $('.simplemenu li a.active').each(function() {
    $(this).parent('li').addClass('active-parent')
  })
});