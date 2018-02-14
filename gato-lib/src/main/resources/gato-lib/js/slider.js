(function ($) {
  var $window = $(window);
  window.GatoSlider = function (opts) {
    var slider = this;
    slider.current = opts.current || 0;
    slider.container = opts.container instanceof jQuery ? opts.container : $(opts.container);
    if (slider.container.length > 1) {
      console.log('GatoSlider container should contain exactly one element, multiple sliders should be given separate GatoSlider instances. Only the first slider on the page will be functional.');
      slider.container = slider.container.eq(0);
    }
    slider.slides = opts.slides instanceof jQuery ? opts.slides : slider.container.find(opts.slides);
    slider.leftarrow = opts.leftarrow instanceof jQuery ? opts.leftarrow : slider.container.find(opts.leftarrow);
    slider.rightarrow = opts.rightarrow instanceof jQuery ? opts.rightarrow : slider.container.find(opts.rightarrow);

    var get_single_touch = function(e) {
      var oe = e.originalEvent;
      if (oe.touches.length != 1) return undefined;
      return oe.touches[0];
    };
    slider.container.on('touchstart', function (e) {
      var t = get_single_touch(e);
      slider.tracking = typeof(t) != 'undefined' && slider.slides.length > 1;
      if (!slider.tracking) return;
      slider.touchX = t.pageX;
      slider.touchY = t.pageY - $window.scrollTop();
    });
    slider.container.on('touchmove', function (e) {
      if (!slider.tracking) return;
      var t = get_single_touch(e);
      slider.xdiff = t.pageX - slider.touchX;
      slider.ydiff = t.pageY - $window.scrollTop() - slider.touchY;
      if (Math.abs(slider.ydiff) > 40) {
        slider.tracking = false;
        slider.dragging = false;
        slider.reset();
      } else if (slider.dragging || (Math.abs(slider.xdiff) > Math.abs(slider.ydiff) && Math.abs(slider.xdiff) > 10)) {
        slider.dragging = true;
        slider.drag(slider.xdiff);
        e.preventDefault();
      }
    });
    slider.container.on('touchend', function (e) {
      if (!slider.tracking) return;
      if (slider.dragging) {
        e.preventDefault();
        if (Math.abs(slider.xdiff) < 40) slider.reset();
        else slider.finishdrag(slider.xdiff);
      }
      slider.tracking = false;
      slider.dragging = false;
    });
    slider.leftarrow.click(function(e) { e.preventDefault(); slider.left(); });
    slider.rightarrow.click(function(e) { e.preventDefault(); slider.right(); });
    slider.reset();
    slider.container.find('img[data-src]').each(function () {
      var img = $(this);
      $window.load(function () {
        img.attr('src', img.data('src')).removeAttr('data-src');
        img.attr('srcset', img.data('srcset')).removeAttr('data-srcset');
      });
    });
  }
  window.GatoSlider.prototype.cleanindex = function (index) {
    var size = this.slides.length;
    if (index < 0) return index % size == 0 ? 0 : size + index % size;
    return index % size;
  }
  window.GatoSlider.prototype.nextidx = function (direction) {
    return this.cleanindex(direction < 0 ? this.current - 1 : this.current + 1);
  }
  window.GatoSlider.prototype.next = function (direction) {
    return this.slides.eq(this.nextidx(direction));
  }
  window.GatoSlider.prototype.left = function () { this.activate(this.current-1); }
  window.GatoSlider.prototype.right = function () { this.activate(this.current+1); }
  window.GatoSlider.prototype.activate = function(index) {
    var slider = this;

    // figure this out before wrapping so that we still slide from the correct direction
    var slidefromright = index > slider.current;

    index = slider.cleanindex(index);
    if (index == slider.current) return;
    var curr = slider.slides.eq(slider.current);
    var next = slider.slides.eq(index);
    if (slidefromright) { // sliding from the right
      next.velocity({translateX: ['0%','100%']}, {duration: 150});
      curr.velocity({translateX: ['-100%','0%']}, {duration: 150});
    } else { // sliding from the left
      next.velocity({translateX: ['0%','-100%']}, {duration: 150});
      curr.velocity({translateX: ['100%','0%']}, {duration: 150});
    }
    slider.current = index;
  }
  window.GatoSlider.prototype.drag = function(xdiff) {
    var slider = this;
    var curr = slider.slides.eq(slider.current);
    var next = slider.next(xdiff);

    cancelanimationframe(slider.dragtimer);
    slider.dragtimer = animationframe(function () {
      curr.css('transform', 'translateX('+xdiff+'px)');
      next.css('transform', 'translateX('+((xdiff < 0 ? 1 : -1)*next.outerWidth() + xdiff)+'px)');
    });
  }
  window.GatoSlider.prototype.finishdrag = function (xdiff) {
    var slider = this;
    cancelanimationframe(slider.dragtimer);
    var curr = slider.slides.eq(slider.current);
    var next = slider.next(xdiff);
    next.velocity({translateX: [0, ((xdiff < 0 ? 1 : -1)*next.outerWidth() + xdiff)+'px']}, {duration: 150});
    curr.velocity({translateX: [(xdiff < 0 ? -1 : 1)*next.outerWidth()+'px', xdiff+'px']}, {duration: 150});
    slider.current = slider.nextidx(xdiff)
  }
  window.GatoSlider.prototype.reset = function () {
    var slider = this;
    cancelanimationframe(slider.dragtimer);
    var curr = slider.slides.eq(slider.current);
    animationframe(function () {
      curr.css('transform', 'translateX(0)');
      slider.slides.not(':eq('+slider.current+')').css('transform', 'translateX(-100%)');
    });
  }
})(jQuery);
