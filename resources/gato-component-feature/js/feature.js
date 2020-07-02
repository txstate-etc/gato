var GATO_MOVINGIMAGE_TIMINGS = { 'none':20000, 'slow':20000, 'medium':20000, 'fast':20000}

jQuery(document).ready(function($) {

  var NONE = 0, SLOW = 10, MEDIUM = 7.5, FAST = 5;

  $('.gato-slideshow').each(function() {
    var $slideshow = $(this)
    var speed = $(this).attr('data-feature-timer')
    var movingimageduration = GATO_MOVINGIMAGE_TIMINGS[speed.toLowerCase()]
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
          if (speed > SLOW) {
            speed = SLOW;
          }
        }
        break;
    }
    new GatoFeatureSlider({
      container: $(this),
      slides: '.slide',
      leftarrow: '.arrow-container .prev',
      rightarrow: '.arrow-container .next',
      rotationtime: speed,
      pausebutton: '.btnPauseSlider',
      navdots: '.nav-dots .dot',
      movingimageduration: movingimageduration
    });
    resizeTimeout(function() {
      var maxHeight = 0;
      $slideshow.find('.slides .slide .slide-content').each(function() {
        var h = $(this).height()
        if (h > maxHeight) maxHeight = h
      })
      $slideshow.find('.slides').css('height', Math.max(maxHeight, ($slideshow.width() * 9.0/16.0)))
      $slideshow.find(".slides .moving-image").each(function(index,slide){
        $(slide).find('.image-container').height($slideshow.width() * 9.0 / 16.0)
      })
    })
  });

});
