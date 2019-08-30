jQuery(document).ready(function($) {
  $('.simplemenu li a.active').each(function() {
    $(this).parent('li').addClass('active-parent')
  })
  
  //set initial landing page banner sizing
  $('.banner-image').each(function() {
    var $container = $(this);
    var $img = $container.find('img');
    var container_ar = (1.0*$container.outerWidth()) / $container.outerHeight();
    var image_ar = (1.0*$img.attr('width')) / $img.attr('height');
    if (!isNaN(container_ar) && !isNaN(image_ar)) {
      if (image_ar > container_ar) $container.removeClass('tall').addClass('wide');
      else $container.removeClass('wide').addClass('tall');
    }
  });
});