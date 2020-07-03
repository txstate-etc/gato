var GATO_MOVINGIMAGE_TIMINGS = { 'none':20000, 'slow':20000, 'medium':20000, 'fast':20000}

jQuery(document).ready(function($) {
(function ($) {
  var $window = $(window);
  window.GatoFeatureSlider = function (opts) {
    var slider = this;
    opts = opts || {};
    slider.current = opts.current || 0;
    slider.container = opts.container instanceof jQuery ? opts.container : $(opts.container);
    if (slider.container.length > 1) {
      console.log('GatoFeatureSlider container should contain exactly one element, multiple sliders should be given separate GatoFeatureSlider instances. Only the first slider on the page will be functional.');
      slider.container = slider.container.eq(0);
    }
    slider.slides = opts.slides instanceof jQuery ? opts.slides : slider.container.find(opts.slides);
    slider.leftarrow = opts.leftarrow instanceof jQuery ? opts.leftarrow : slider.container.find(opts.leftarrow);
    slider.rightarrow = opts.rightarrow instanceof jQuery ? opts.rightarrow : slider.container.find(opts.rightarrow);
    slider.pausebutton = opts.pausebutton instanceof jQuery ? opts.pausebutton : slider.container.find(opts.pausebutton);
    slider.navdots = opts.navdots instanceof jQuery ? opts.navdots : slider.container.find(opts.navdots);

    slider.currentMovingImage = {
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
      },
      image: null,
      progress: 0
    }


    resizeTimeout(function () {
      slider.verticaldragthreshold = 0.2*slider.container.outerHeight();
      slider.horizontaldragthreshold = 0.2*slider.container.outerWidth();
    });
    var resizeTimer;
    $(window).resize(function(){
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        slider.resizeMovingImage()
      }, 250);
    });
    var get_single_touch = function(e) {
      var oe = e.originalEvent;
      if (oe.touches && oe.touches.length == 1) return oe.touches[0];
      if (e.pageX) return e;
      return undefined;
    };
    slider.container.on('touchstart mousedown', function (e) {
      var t = get_single_touch(e);
      slider.tracking = typeof(t) != 'undefined' && slider.slides.length > 1;
      if (!slider.tracking) return;
      slider.pauseschedule();
      slider.touchX = t.pageX;
      slider.touchY = t.pageY - $window.scrollTop();
      if (e.type == 'mousedown') e.preventDefault();
    });
    slider.container.on('touchmove mousemove', function (e) {
      if (!slider.tracking) return;
      var t = get_single_touch(e);
      if (typeof(t) == 'undefined') return;
      slider.xdiff = t.pageX - slider.touchX;
      slider.ydiff = t.pageY - $window.scrollTop() - slider.touchY;
      if (Math.abs(slider.ydiff) > slider.verticaldragthreshold) {
        slider.tracking = false;
        slider.dragging = false;
        if (Math.abs(slider.xdiff) > slider.horizontaldragthreshold) slider.finishdrag(slider.xdiff)
        else slider.reset();
      } else if (slider.dragging || (Math.abs(slider.xdiff) > Math.abs(slider.ydiff) && Math.abs(slider.xdiff) > 10)) {
        slider.dragging = true;
        slider.drag(slider.xdiff);
        e.preventDefault();
      }
    });
    $window.on('touchend mouseup', function (e) {
      if (!slider.tracking) return;
      if (slider.dragging) {
        slider.stopclick = e.type == 'mouseup';
        e.preventDefault();
        if (Math.abs(slider.xdiff) < slider.horizontaldragthreshold) slider.reset();
        else slider.finishdrag(slider.xdiff);
      }
      slider.tracking = false;
      slider.dragging = false;
    });
    $window.blur(function (e) { slider.pauseschedule(); });
    $window.focus(function (e) { slider.schedule(); });

    slider.container.click(function(e) { if (slider.stopclick) e.preventDefault(); slider.stopclick = false; });
    slider.leftarrow.click(function(e) { e.preventDefault(); slider.left(); });
    slider.rightarrow.click(function(e) { e.preventDefault(); slider.right(); });
    slider.pausebutton.click(function(e) {
      e.preventDefault();
      if ($(this).hasClass('paused')) {
        $(this).removeClass('paused');
        slider.schedule();
        if (slider.slides.eq(slider.current).hasClass('moving-image')) {
          slider.startMovingImage(slider.slides.eq(slider.current))
        }
      }
      else {
        $(this).addClass('paused');
        slider.pauseschedule();
        if (slider.slides.eq(slider.current).hasClass('moving-image')) {
          cancelanimationframe(slider.movingImageAnimationFrame)
          var currentMovingImage = slider.currentMovingImage
          var progress = currentMovingImage.progress
          var scale = currentMovingImage.start.scale + progress * (currentMovingImage.target.scale - currentMovingImage.start.scale)
          var transX = currentMovingImage.start.transX + progress * (currentMovingImage.target.transX - currentMovingImage.start.transX)
          var transY = currentMovingImage.start.transY + progress * (currentMovingImage.target.transY - currentMovingImage.start.transY)
          currentMovingImage.start.scale = scale
          currentMovingImage.start.transX = transX
          currentMovingImage.start.transY = transY
          var timeRemaining = currentMovingImage.duration - (currentMovingImage.progress * currentMovingImage.duration)
          currentMovingImage.duration = timeRemaining
        }
      }
    })
    slider.navdots.click(function(e) {
      var navindex = $(e.target).index()
      slider.activate(navindex, 300)
    })
    slider.reset();

    slider.navdots.keydown(function(e) {
      if (e.keyCode == KeyCodes.RIGHT) {
        slider.right()
        slider.navdots.eq(slider.current).focus()
      }
      else if (e.keyCode == KeyCodes.LEFT) {
        slider.left()
        slider.navdots.eq(slider.current).focus()
      }
    })
    slider.container.find('img[data-src]').each(function () {
      var img = $(this);
      $window.load(function () {
        img.attr('src', img.data('src')).removeAttr('data-src');
        img.attr('srcset', img.data('srcset')).removeAttr('data-srcset');
      });
    });
    slider.rotationtime = opts.rotationtime*1000 || 0;
    slider.rotationminimum = opts.rotationminimum*1000 || 0;
    slider.movingimageduration = opts.movingimageduration || 20000;

    if (slider.slides.eq(this.current).hasClass('moving-image')) {
      var loaded = false;
      slider.slides.eq(this.current).find('img').on('load', function(){
        slider.updateMovingImageState(slider.slides.eq(slider.current))
        slider.startMovingImage(slider.slides.eq(slider.current))
      })
    }
    slider.schedule();
  }
  window.GatoFeatureSlider.prototype.cleanindex = function (index) {
    var size = this.slides.length;
    if (index < 0) return index % size == 0 ? 0 : size + index % size;
    return index % size;
  }
  window.GatoFeatureSlider.prototype.nextidx = function (direction) {
    return this.cleanindex(direction < 0 ? this.current + 1 : this.current - 1);
  }
  window.GatoFeatureSlider.prototype.next = function (direction) {
    return this.slides.eq(this.nextidx(direction));
  }
  window.GatoFeatureSlider.prototype.left = function (speed) { this.activate(this.current-1, speed); }
  window.GatoFeatureSlider.prototype.right = function (speed) { this.activate(this.current+1, speed);
   }
  window.GatoFeatureSlider.prototype.activate = function(index, speed) {
    var slider = this;
    speed = speed || 150;

    // figure this out before wrapping so that we still slide from the correct direction
    var slidefromright = index > slider.current;

    index = slider.cleanindex(index);
    if (index == slider.current) return;
    var curr = slider.slides.eq(slider.current);
    var next = slider.slides.eq(index);
    slider.synchronizestate();
    var prev = slider.current
    if (slidefromright) { // sliding from the right
      next.velocity({translateX: ['0%','100%']}, {duration: speed, complete: function() {
        next.attr('tabindex', 0)
        slider.navdots.eq(index).addClass('active')
        slider.navdots.eq(index).attr('aria-selected', true)
        slider.navdots.eq(index).attr('tabindex', 0)
        next.find('a').attr('tabindex', 0)
        if (next.hasClass('moving-image')) {
          slider.startMovingImage(next)
        }
        },
        begin: function() {
          if (next.hasClass('moving-image')) {
            slider.updateMovingImageState(next)
            var currentMovingImage = slider.currentMovingImage
            var transform = 'scale(' + currentMovingImage.start.scale + ',' + currentMovingImage.start.scale + ') translate(' + currentMovingImage.start.transX + 'px,' + currentMovingImage.start.transY + 'px)'
            currentMovingImage.image.css('transform', transform )
          }
        }});
      curr.velocity({translateX: ['-100%','0%']}, {duration: speed, complete: function() {
        curr.attr('tabindex', -1)
        slider.navdots.eq(prev).removeClass('active')
        slider.navdots.eq(prev).attr('aria-selected', false)
        slider.navdots.eq(prev).attr('tabindex', -1)
        curr.find('a').attr('tabindex', -1)
      }});
    } else { // sliding from the left
      next.velocity({translateX: ['0%','-100%']}, {duration: speed, complete: function() {
        next.attr('tabindex', 0)
        slider.navdots.eq(index).addClass('active')
        slider.navdots.eq(index).attr('aria-selected', true)
        slider.navdots.eq(index).attr('tabindex', 0)
        if (next.hasClass('moving-image')) {
          slider.startMovingImage(next)
        }
      },
      begin: function() {
        if (next.hasClass('moving-image')) {
          slider.updateMovingImageState(next)
          var currentMovingImage = slider.currentMovingImage
          var transform = 'scale(' + currentMovingImage.start.scale + ',' + currentMovingImage.start.scale + ') translate(' + currentMovingImage.start.transX + 'px,' + currentMovingImage.start.transY + 'px)'
          currentMovingImage.image.css('transform', transform )
        }
      }});
      curr.velocity({translateX: ['100%','0%']}, {duration: speed, complete: function() {
        curr.attr('tabindex', -1)
        slider.navdots.eq(prev).removeClass('active')
        slider.navdots.eq(prev).attr('aria-selected', false)
        slider.navdots.eq(prev).attr('tabindex', -1)
        curr.find('a').attr('tabindex', -1)
      }});
    }
    slider.current = index;
    if (!slider.pausebutton.hasClass('paused'))
      slider.schedule();
  }

  window.GatoFeatureSlider.prototype.schedule = function () {
    var slider = this;
    if (slider.slides.length > 1 && slider.rotationtime > 0 && !window.isEditMode) {
      var delay = slider.rotationtime;
      if (slider.rotationminimum) delay = Math.floor(Math.random() * (slider.rotationtime - slider.rotationminimum) + slider.rotationminimum);
      clearTimeout(slider.rotationtimer);
      slider.rotationtimer = setTimeout(function () {
        slider.right(300);
      }, delay);
    }
  }
  window.GatoFeatureSlider.prototype.pauseschedule = function () {
    var slider = this;
    clearTimeout(slider.rotationtimer);
  }
  window.GatoFeatureSlider.prototype.synchronizestate = function () {
    var slider = this;
    slider.slides.velocity('stop');
    var curr = slider.slides.eq(slider.current);
    animationframe(function () {
      curr.css('transform', 'translateX(0)');
      slider.slides.not(':eq('+slider.current+')').css('transform', 'translateX(-100%)');
    });
    if (curr.hasClass('moving-image')) {
      cancelanimationframe(slider.movingImageAnimationFrame)
    }
  }
  window.GatoFeatureSlider.prototype.drag = function(xdiff) {
    var slider = this;
    var curr = slider.slides.eq(slider.current);
    var next = slider.next(xdiff);

    cancelanimationframe(slider.dragtimer);
    slider.dragtimer = animationframe(function () {
      curr.css('transform', 'translateX('+xdiff+'px)');
      next.css('transform', 'translateX('+((xdiff < 0 ? 1 : -1)*next.outerWidth() + xdiff)+'px)');
    });
  }
  window.GatoFeatureSlider.prototype.finishdrag = function (xdiff) {
    var slider = this;
    cancelanimationframe(slider.dragtimer);
    var curr = slider.slides.eq(slider.current);
    var next = slider.next(xdiff);
    var startIndex = slider.current
    var nextIndex = slider.nextidx(xdiff);
    slider.synchronizestate();
    next.velocity({translateX: [0, ((xdiff < 0 ? 1 : -1)*next.outerWidth() + xdiff)+'px']}, {
      duration: 150,
      begin: function() {
        if (next.hasClass('moving-image')) {
          slider.updateMovingImageState(next)
          var currentMovingImage = slider.currentMovingImage
          var transform = 'scale(' + currentMovingImage.start.scale + ',' + currentMovingImage.start.scale + ') translate(' + currentMovingImage.start.transX + 'px,' + currentMovingImage.start.transY + 'px)'
          currentMovingImage.image.css('transform', transform )
        }
      },
      complete: function() {
        next.attr('tabindex', 0)
        slider.navdots.eq(nextIndex).addClass('active')
        slider.navdots.eq(nextIndex).attr('aria-selected', true)
        slider.navdots.eq(nextIndex).attr('tabindex', 0)
        curr.find('a').attr('tabindex', 0)
        if (next.hasClass('moving-image')) {
          slider.startMovingImage(next)
        }
      }});
    curr.velocity({translateX: [(xdiff < 0 ? -1 : 1)*next.outerWidth()+'px', xdiff+'px']}, {
      duration: 150,
      complete: function() {
        curr.attr('tabindex', -1)
        slider.navdots.eq(startIndex).removeClass('active')
        slider.navdots.eq(startIndex).attr('aria-selected', false)
        slider.navdots.eq(startIndex).attr('tabindex', -1)
        curr.find('a').attr('tabindex', -1)
      }});
    slider.current = slider.nextidx(xdiff);
    slider.schedule();
  }
  window.GatoFeatureSlider.prototype.reset = function () {
    var slider = this;
    cancelanimationframe(slider.dragtimer);
    slider.synchronizestate();
    slider.schedule();
  }
  window.GatoFeatureSlider.prototype.calculateImageContainerHeight = function (slide) {
    return slide.width() * 9.0 / 16.0
  }
  window.GatoFeatureSlider.prototype.updateMovingImageState = function (slide) {
    var slider = this;
    var currentMovingImage = slider.currentMovingImage
    if (!slide) {
      slide = slider.slides.eq(slider.current);
    }
    currentMovingImage.image = slide.find('img')

    currentMovingImage.duration = slider.movingimageduration

    var containerWidth = slide.width()
    var containerHeight = slider.calculateImageContainerHeight(slide)
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

  window.GatoFeatureSlider.prototype.animateMovingImage = function (args) {
    var slider = this
    var start = performance.now()
    var duration = args.duration
    var draw = args.draw
    var timing = args.timing
    var callback = args.callback

    slider.movingImageAnimationFrame = animationframe(function animate(time) {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;
      let progress = timing(timeFraction)

      draw(progress);

      if (timeFraction < 1) {
        slider.movingImageAnimationFrame = animationframe(animate);
      }
      else {
        callback()
      }

    });
  }
  window.GatoFeatureSlider.prototype.startMovingImage = function (slide) {
    var slider = this
    if (slider.pausebutton.hasClass('paused')) return;
    if (slider.rotationtime > 0) {
      slider.pauseschedule()
    }

    slider.animateMovingImage({
      duration: slider.currentMovingImage.duration,
      timing: function(timeFraction) {
        return timeFraction;
      },
      draw: function(progress) {
        var currentMovingImage = slider.currentMovingImage
        currentMovingImage.progress = progress
        //progress will be a percentage in decimal format
        var scale = currentMovingImage.start.scale + progress * (currentMovingImage.target.scale - currentMovingImage.start.scale)
        var transX = currentMovingImage.start.transX + progress * (currentMovingImage.target.transX - currentMovingImage.start.transX)
        var transY = currentMovingImage.start.transY + progress * (currentMovingImage.target.transY - currentMovingImage.start.transY)

        var transform = 'scale(' + scale + ',' + scale + ') translate(' + transX + 'px,' + transY + 'px)'
       //console.log(transform)
        currentMovingImage.image.css('transform', transform )
      },
      callback: function() {
        if (slider.rotationtime > 0) {
          setTimeout(function() {
            slider.schedule()
          }, slider.rotationtime*0.1)
        }
      }
    })
  }
  window.GatoFeatureSlider.prototype.resizeMovingImage = function () {
    var slider = this
    var activeSlide = slider.slides.eq(slider.current)
    if (activeSlide.hasClass('moving-image')) {
      slider.updateMovingImageState(activeSlide)
    }
  }
})(jQuery);

})
