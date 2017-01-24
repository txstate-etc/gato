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
      adaptiveHeight: false,
      autoplay: !isEditMode && (speed > 0),
      autoplaySpeed: speed,
      accessibility: true,
      lazyLoad: 'progressive'
    });
  });
});

//Limit text on image slides to two lines.  If the text goes over 2 lines, truncate it and
//add an ellipsis.  This code calculates a maximum height based on the line height and removes
//one word at a time until the content is truncated enough to fit on two lines.  It also removes
//some special characters from the end of words so you don't have something like 
//question?... or fire!...  Once the position of the caption is relative (slider is in a smaller area), 
//the entire text is shown in the caption area under the image
resizeTimeout(function(){
  jQuery('.gato-slider .slides .slide .caption p').each(function(){
    var description = jQuery(this);
    var originalText = description.attr('data-orig-text');
    var caption = description.closest('.caption');
    if(caption.css('position') == 'absolute'){
      var maxLineHeight = Math.round(2 * parseFloat(description.css('line-height')));
      //if this has been resized, we need the reset the original text
      description.text(originalText);
      var height = Math.round(description.height());
      //in this case, it is already small enough
      if(height <= maxLineHeight) return
      //remove one word at a time from the end until it fits
      var wordsToRemove = 0;
      var words = originalText.split(" ");
      while(height > maxLineHeight){
        var newText = words.slice(0, words.length-wordsToRemove).join(' ') + "...";
        description.text(newText);
        height = Math.round(description.height());
        wordsToRemove++;
      }
      //If these characters appear right before the ellipsis it will look strange, so remove them
      var uglyLastCharacters = [ ' ', '\u3000', ',', ';', '.', '!', '?' ];
      if(newText.length > 4){
        var lastChar = newText.charAt(newText.length-4);
        var index = jQuery.inArray(lastChar, uglyLastCharacters);
        while(index > -1 && newText.length > 4){
          newText = newText.slice(0,newText.length-4) + newText.slice(newText.length-3); 
          lastChar = newText.charAt(newText.length-4);
          index = jQuery.inArray(lastChar, uglyLastCharacters);
        }
      }
      description.text(newText);
    }
    else{
      //The caption is beneath the image, no need to truncate
      description.text(originalText);
    }
  })
});
