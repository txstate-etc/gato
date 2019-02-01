var GATO_MOVINGIMAGE_TIMINGS = { 'none':20000, 'slow':20000, 'medium':20000, 'fast':20000};
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

    $(this).find('.slides').on('init', function(slick){
      $(this).find(".moving-image").each(function(index,slide){
        var $slide = $(slide);
        setHeight($slide);
        var data = $slide.find('.cropData');
        var startCrop = { left: parseFloat(data.attr('data-start-left')),
                    top: parseFloat(data.attr('data-start-top')),
                    right: parseFloat(data.attr('data-start-right')),
                    bottom: parseFloat(data.attr('data-start-bottom'))}
        $slide.find('img').load(function(){
          var startTransform = calculateTransform($slide, startCrop)
          $.Velocity.hook($(this), "scaleX", startTransform.scale)
          $.Velocity.hook($(this), "scaleY", startTransform.scale)
          $.Velocity.hook($(this), "translateX", startTransform.translateX + "px")
          $.Velocity.hook($(this), "translateY", startTransform.translateY + "px")
        })
      })
      //The animation for moving image slides starts in the afterChange
      //event.  The first slide won't have this event on load so it needs
      //to be animated on init
      var slide = $(this).find('.slick-current')
      if(slide.hasClass('moving-image')){
        slide.find('img').load(function(){
          startMovingImage(slide)
        })
      }
    })

    $(this).find('.slides').slick({
      dots: true,
      adaptiveHeight: false,
      autoplay: !isEditMode && (speed > 0),
      autoplaySpeed: speed,
      accessibility: true,
      appendArrows: $(this).find('.arrow-container'),
      slide: '.slide',
      lazyLoad: 'progressive',
      rows: 0
    });

  });

  //The height needs to be set because the image-container div only
  //contains the absolute positioned image, so it has height 0
  function setHeight(slide){
    slide.find('.image-container').height(slide.width() * 9.0 / 16.0)
  }

  function calculateTransform(slide, cropData){
    //need to use the offsetWidth and Height instead of the naturalHeight property
    //because it is consistent between browsers
    var naturalWidth = slide.find('img')[0].offsetWidth;
    var naturalHeight = slide.find('img')[0].offsetHeight;

    var cropWidth = naturalWidth * (cropData.right - cropData.left);
    //If they haven't cropped the image, don't transform it
    if(cropWidth == 0) {
      return {scale: 1, translateX: 0, translateY: 0}
    }

    //get the width and height of the container
    var containerW = slide.find('.image-container').width();
    var containerH = slide.find('.image-container').height();

    var scale = containerW / cropWidth;

    var transX = -1  * naturalWidth * parseFloat(cropData.left);
    var transY = -1 * naturalHeight * parseFloat(cropData.top);

    return {scale: scale, translateX: transX, translateY: transY}
  }

  function startMovingImage(slide){
    var slideshow = slide.closest('.slides');
    var speedstr = slide.closest('.gato-slider').data('feature-timer');
    var speed = GATO_MOVINGIMAGE_TIMINGS[speedstr.toLowerCase()];
    //if slide show is auto-rotating, pause it to allow the moving image animation to finish
    if (slideshow.slick('slickGetOption', 'autoplay')) {
      slideshow.slick('slickPause');
    }
    setHeight(slide);
    //get the crop data
    var data = slide.find('.cropData');
    var endCrop = { left: parseFloat(data.attr('data-end-left')),
                    top: parseFloat(data.attr('data-end-top')),
                    right: parseFloat(data.attr('data-end-right')),
                    bottom: parseFloat(data.attr('data-end-bottom'))}
    if(endCrop.right < endCrop.left) endCrop.right = 1;
    if(endCrop.bottom < endCrop.top) endCrop.bottom = 1;
    endTransform = calculateTransform(slide, endCrop)

    slide.find('img').velocity({
                              scaleX: endTransform.scale,
                              scaleY: endTransform.scale,
                              translateX: endTransform.translateX + 'px',
                              translateY: endTransform.translateY +'px'
                            },
                            {
                              duration: speed,
                              easing: 'linear',
                              complete: function() {
                                //restart slideshow if it is set to auto-rotate
                                if (slideshow.slick('slickGetOption', 'autoplay')) {
                                  setTimeout(function(){
                                    slideshow.slick('slickPlay').slick('slickNext');
                                  }, speed*0.1);
                                }
                              }
                            })

  }

  $('.gato-slider').on('afterChange', function(event, slick, currentSlide){
    var slide = $(slick.$slides[currentSlide]);
    if(slide.hasClass('moving-image')){
      startMovingImage(slide)
    }
    //reset previous slide
    var previousSlideIndex = currentSlide - 1;
    if(previousSlideIndex == -1) previousSlideIndex = slick.$slides.length - 1;
    var previousSlide = $(slick.$slides[previousSlideIndex])
    if(previousSlide.hasClass('moving-image')){
      resetAnimation(previousSlide)
    }
    //reset next slide, because they could be moving backwards
    var nextSlideIndex = (currentSlide + 1) % slick.$slides.length;
    var nextSlide = $(slick.$slides[nextSlideIndex])
    if(nextSlide.hasClass('moving-image')){
      resetAnimation(nextSlide)
    }
  });

  function resetAnimation(slide){
    var image = slide.find('img')
    image.velocity("stop");
    var data = slide.find('.cropData');
    var startCrop = { left: parseFloat(data.attr('data-start-left')),
                    top: parseFloat(data.attr('data-start-top')),
                    right: parseFloat(data.attr('data-start-right')),
                    bottom: parseFloat(data.attr('data-start-bottom'))}
    var startTransform = calculateTransform(slide, startCrop)
    slide.find('img').velocity({
                            scaleX: startTransform.scale,
                            scaleY: startTransform.scale,
                            translateX: startTransform.translateX + 'px',
                            translateY: startTransform.translateY +'px'
                          },
                          {
                            duration: 500
                          })
  }

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
