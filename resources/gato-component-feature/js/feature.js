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

    //The animation for moving image slides starts in the afterChange
    //event.  The first slide won't have this event on load so it needs
    //to be animated on init
    $(this).find('.slides').on('init', function(slick){
      //get first slide
      var slide = $(this).find('.slick-current')
      if(slide.hasClass('moving-image')){
        slide.find('img').load(function(){
          initMovingImage(slide)
        })
      }
    })

    $(this).find('.slides').slick({
      dots: true,
      adaptiveHeight: false,
      autoplay: !isEditMode && (speed > 0),
      autoplaySpeed: speed,
      accessibility: true,
      lazyLoad: 'progressive'
    });

  });

  //The height needs to be set because the image-container div only
  //contains the absolute positioned image, so it has height 0
  function setHeight(slide){
    slide.find('.image-container').height(slide.width() * 9.0 / 16.0)
  }

  function transformImage(slide, cropData){

    var naturalWidth = slide.find('img')[0].naturalWidth;
    var naturalHeight = slide.find('img')[0].naturalHeight;

    var cropWidth = naturalWidth * (cropData.right - cropData.left);
    var cropHeight = naturalHeight * (cropData.bottom - cropData.top);

    //get the width and height of the container
    var containerW = slide.find('.image-container').width();
    var containerH = slide.find('.image-container').height();

    var scale = containerW / cropWidth;

    //get the scaled width and height of the image
    var imageScaledW = naturalWidth * scale;
    var left = -1 * imageScaledW * cropData.left;

    var imageScaledH = naturalHeight * scale;
    var top = -1 * imageScaledH * cropData.top;

    //the next 4 lines are for testing
    // slide.find('.image').css('left', left + "px");
    // slide.find('.image').css('top', top + "px");
    // slide.find('.image').css('width', imageScaledW)
    // slide.find('.image').css('height', imageScaledH)

    return {width: imageScaledW, height: imageScaledH, left: left + "px", top: top + "px"}
  }

  function initMovingImage(slide){

    setHeight(slide);
    //get the crop data
    var data = slide.children('.cropData');
    var startCrop = { left: parseFloat(data.attr('data-start-left')),
                    top: parseFloat(data.attr('data-start-top')),
                    right: parseFloat(data.attr('data-start-right')),
                    bottom: parseFloat(data.attr('data-start-bottom'))}
    if(startCrop.right < startCrop.left) startCrop.right = 1;
    if(startCrop.bottom < startCrop.top) startCrop.bottom = 1;
    var endCrop = { left: parseFloat(data.attr('data-end-left')),
                    top: parseFloat(data.attr('data-end-top')),
                    right: parseFloat(data.attr('data-end-right')),
                    bottom: parseFloat(data.attr('data-end-bottom'))}
    if(endCrop.right < endCrop.left) endCrop.right = 1;
    if(endCrop.bottom < endCrop.top) endCrop.bottom = 1;

    startTransform = transformImage(slide, startCrop)
    endTransform = transformImage(slide, endCrop)

    slide.find('img').velocity({
                                width: [endTransform.width, startTransform.width],
                                height: [endTransform.height, startTransform.height],
                                left: [endTransform.left, startTransform.left],
                                top: [endTransform.top, startTransform.top]
                               },
                               {
                                  duration: 30000,
                                  easing: 'linear'
                               }
                              )

  }

  $('.gato-slider').on('afterChange', function(event, slick, currentSlide){
    var slide = $(slick.$slides[currentSlide]);
    if(slide.hasClass('moving-image')){
      initMovingImage(slide)
    }
  });

  //for moving images, update image container height when width changes
  resizeTimeout(function(){
    jQuery('.gato-slider .slides .moving-image').each(function(){
      var slide = jQuery(this);
      setHeight(slide);
    })
  })
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
    var originalText = description.data('orig-text').replace(/<br\/?>/i,'').replace(/<[^>]*\s[^>]*>/, '').replace(/\s+(<\/[^>]*>)/, '$1').replace(/(<[^\/][^>]*>)\s+/, '$1');
    var caption = description.closest('.caption');
    if(caption.css('position') == 'absolute' && !description.data('skip-truncation')){
      var maxLineHeight = Math.round(2 * parseFloat(description.css('line-height')));
      //if this has been resized, we need the reset the original text
      description.html(originalText);
      var height = Math.round(description.height());
      //in this case, it is already small enough
      if(height <= maxLineHeight) return
      //remove one word at a time from the end until it fits
      var wordsToRemove = 0;
      var words = originalText.split(" ");
      while(height > maxLineHeight){
        var newText = words.slice(0, words.length-wordsToRemove).join(' ') + "...";
        description.html(newText);
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
      description.html(newText);
    }
    else{
      //The caption is beneath the image, no need to truncate
      description.html(originalText);
    }
  })
});
