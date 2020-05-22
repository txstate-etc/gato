var GATO_MOVINGIMAGE_TIMINGS = { 'none':20000, 'slow':20000, 'medium':20000, 'fast':20000};

jQuery(document).ready(function($) {
  var NONE = 0, SLOW = 10000, MEDIUM = 7500, FAST = 5000;

  var currentMovingImage = {
    startTime: 0,
    duration: 20000,
    container: {
      width: 0,
      height: 0
    },
    start: {
      scale: 1,
      transX: 0,
      transY: 0
    },
    target: {
      scale: 1,
      transX: 0,
      transY: 0
    }
  }

  var currentAnimationFrame

  $('.gato-slider').each(function() {
    var thisSlider = $(this);
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

    $(this).find('.slides').on('init', function(slick) {
      $(this).find(".moving-image").each(function(index,slide){
        $(slide).find('.image-container').height($(slide).width() * 9.0 / 16.0)
      })

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

    function calculateImageContainerHeight(slide) {
      return slide.width() * 9.0 / 16.0
    }

    function updateMovingImageState(slide) {
      if (!slide) {
        slide = $('.slide.slick-current')
      }
      var containerWidth = slide.width()
      var containerHeight = calculateImageContainerHeight(slide)
      currentMovingImage.container.width = containerWidth
      currentMovingImage.container.height = containerHeight
      slide.find('.image-container').height(containerHeight)

      var data = slide.find('.cropData')
      var startCrop = {
        left: parseFloat(data.attr('data-start-left')),
        top: parseFloat(data.attr('data-start-top')),
        right: parseFloat(data.attr('data-start-right')),
        bottom: parseFloat(data.attr('data-start-bottom')),
      }
      var endCrop = {
        left: parseFloat(data.attr('data-end-left')),
        top: parseFloat(data.attr('data-end-top')),
        right: parseFloat(data.attr('data-end-right')),
        bottom: parseFloat(data.attr('data-end-bottom')),
      }

      var naturalWidth = slide.find('img')[0].offsetWidth
      var naturalHeight = slide.find('img')[0].offsetHeight

      currentMovingImage.start.scale = containerWidth / (naturalWidth * (startCrop.right - startCrop.left))
      currentMovingImage.start.transX = -1 * naturalWidth * parseFloat(startCrop.left)
      currentMovingImage.start.transY = -1 * naturalHeight * parseFloat(startCrop.top)

      currentMovingImage.target.scale = containerWidth / (naturalWidth * (endCrop.right - endCrop.left))
      currentMovingImage.target.transX = -1 * naturalWidth * parseFloat(endCrop.left)
      currentMovingImage.target.transY = -1 * naturalHeight * parseFloat(endCrop.top)

      currentMovingImage.startTime = performance.now()
    }

    function animate({duration, draw, timing, callback}) {
      var start = performance.now()

      currentAnimationFrame = requestAnimationFrame(function animate(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        let progress = timing(timeFraction)

        draw(progress);

        if (timeFraction < 1) {
          currentAnimationFrame = requestAnimationFrame(animate);
        }
        else {
          callback()
        }

      });
    }

    function startMovingImage(slide) {
      var slideshow = slide.closest('.slides')
      var speedstr = slide.closest('.gato-slider').data('feature-timer')
      var speed = GATO_MOVINGIMAGE_TIMINGS[speedstr.toLowerCase()]

      if (slideshow.slick('slickGetOption', 'autoplay')) {
        slideshow.slick('slickPause')
      }

      updateMovingImageState(slide)

      animate({
        duration: currentMovingImage.duration,
        timing: function(timeFraction) {
          return timeFraction;
        },
        draw: function(progress) {
          //progress will be a percentage in decimal format
          var scale = currentMovingImage.start.scale + progress * (currentMovingImage.target.scale - currentMovingImage.start.scale)
          var transX = currentMovingImage.start.transX + progress * (currentMovingImage.target.transX - currentMovingImage.start.transX)
          var transY = currentMovingImage.start.transY + progress * (currentMovingImage.target.transY - currentMovingImage.start.transY)

          var transform = 'scale(' + scale + ',' + scale + ') translate(' + transX + 'px,' + transY + 'px)'
        // console.log(transform)
          $('.slide.slick-current.moving-image').find('img').css('transform', transform )
        },
        callback: function() {
          if (slideshow.slick('slickGetOption', 'autoplay')) {
            setTimeout(function(){
              slideshow.slick('slickPlay').slick('slickNext');
            }, speed*0.1);
          }
        }
      })
    }

    $('.gato-slider').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
      var current = $(slick.$slides[currentSlide]);
      if(current.hasClass('moving-image')){
        cancelAnimationFrame(currentAnimationFrame)
        // current.find('img').css('transform', 'none')
      }
      if ($(slick.$slides[nextSlide]).hasClass('moving-image')) {
        startMovingImage($(slick.$slides[nextSlide]))
      }
    })

    var timer;
    function onResize() {
      thisSlider.find(".moving-image").each(function(index,slide){
        $(slide).find('.image-container').height($(slide).width() * 9.0 / 16.0)
      })

      var slide = thisSlider.find('.slick-current')
      if(slide.hasClass('moving-image')){
        updateMovingImageState(slide)
      }
    }
    $(window).resize(function(){
      clearTimeout(timer);
      timer = setTimeout(onResize, 250);
    });

    //Limit text on image slides to two lines.  If the text goes over 2 lines, truncate it and
    // //add an ellipsis.  This code calculates a maximum height based on the line height and removes
    // //one word at a time until the content is truncated enough to fit on two lines.  It also removes
    // //some special characters from the end of words so you don't have something like
    // //question?... or fire!...  Once the position of the caption is relative (slider is in a smaller area),
    // //the entire text is shown in the caption area under the image
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
    })
  })
})
