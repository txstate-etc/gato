jQuery(document).ready(function ($) {
  $('.gato-slider').each(function() {
    var speed = $(this).attr('data-feature-timer');
    $(this).find('.slides').slick({
      dots: true,
      adaptiveHeight: true,
      autoplay: !isEditMode && (speed > 0),
      autoplaySpeed: speed * 1000,
    });
  });
});
