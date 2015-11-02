jQuery(document).ready(function ($) {
  $('.gato-feature').each(function() {
    var speed = $(this).attr('data-feature-timer');
    $(this).find('.gato-feature-slides').slick({
      dots: true,
      adaptiveHeight: true,
      autoplay: !isEditMode && (speed > 0),
      autoplaySpeed: speed * 1000,
    });
  });
});
