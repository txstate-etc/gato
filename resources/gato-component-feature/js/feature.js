jQuery(document).ready(function ($) {
  var NONE = 0, SLOW = 10000, MEDIUM = 7500, FAST = 5000;

  $('.gato-slider').each(function() {
    var speed = $(this).attr('data-feature-timer');
    switch(speed) {
      case 'none':
        speed = NONE;
        break;
      case 'slow':
        speed = SLOW;
        break;
      case 'medium':
        speed = MEDIUM;
        break;
      case 'fast':
        speed = FAST;
        break;
      default:
        speed = parseInt(speed, 10);
        if (isNaN(speed)) {
          speed = 0;
        } else {
          speed *= 1000;
          if (speed > SLOW) {
            speed = SLOW;
          }
        }
        break;
    }
    $(this).find('.slides').slick({
      dots: true,
      adaptiveHeight: true,
      autoplay: !isEditMode && (speed > 0),
      autoplaySpeed: speed,
    });
  });
});
