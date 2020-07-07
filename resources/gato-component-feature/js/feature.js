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
      if ($slideshow.find('.slides .slide').length > 0)
        $slideshow.find('.slides').css('height', Math.max(maxHeight, ($slideshow.width() * 9.0/16.0)))
      $slideshow.find(".slides .moving-image").each(function(index,slide){
        $(slide).find('.image-container').height($slideshow.width() * 9.0 / 16.0)
      })

      //Limit text on image slides to two lines.  If the text goes over 2 lines, truncate it and
      //add an ellipsis.  This code calculates a maximum height based on the line height and removes
      //one word at a time until the content is truncated enough to fit on two lines.  It also removes
      //some special characters from the end of words so you don't have something like
      //question?... or fire!...  Once the position of the caption is relative (slider is in a smaller area),
      //the entire text is shown in the caption area under the image
      $('.gato-slideshow .slides .slide .caption p').each(function() {
        var description = $(this)
        var originalText = description.data('orig-text').replace(/<br\/?>/i,'').replace(/<[^>]*\s[^>]*>/, '').replace(/\s+(<\/[^>]*>)/, '$1').replace(/(<[^\/][^>]*>)\s+/, '$1');
        var caption = description.closest('.caption');
        if(caption.css('position') == 'absolute' && !description.data('skip-truncation')){
          var maxLineHeight = Math.round(2 * parseFloat(description.css('line-height')))
          //if this has been resized, we need to reset the original text
          description.html(originalText)
          var height = Math.round(description.height())
          //in this case, it is already small enough
          if (height <= maxLineHeight) return
          //remove one word at a time from the end until it fits
          var wordsToRemove = 0
          var words = originalText.split(" ")
          while (height > maxLineHeight) {
            var newText = words.slice(0, words.length-wordsToRemove).join(' ') + "..."
            description.html(newText)
            height = Math.round(description.height())
            wordsToRemove ++;
          }
          //If these characters appear right before the ellipsis it will look strange, so remove them
          var uglyLastCharacters = [ ' ', '\u3000', ',', ';', '.', '!', '?' ]
          if (newText.length > 4){
            var lastChar = newText.charAt(newText.length-4)
            var index = jQuery.inArray(lastChar, uglyLastCharacters);
            while(index > -1 && newText.length > 4){
              newText = newText.slice(0,newText.length-4) + newText.slice(newText.length-3);
              lastChar = newText.charAt(newText.length-4);
              index = jQuery.inArray(lastChar, uglyLastCharacters);
            }
          }
          description.html(newText);
        }
        else{
          //The caption is beneath the image, no need to truncate
          description.html(originalText);
        }
      })
    })
  });
});
