(function ($) {
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
    slider.lazyload

    slider.leftarrow.click(function(e) { e.preventDefault(); slider.left(); });
    slider.rightarrow.click(function(e) { e.preventDefault(); slider.right(); });
    slider.slides.not(':eq('+slider.current+')').css('left', '-100%');
  }
  window.GatoSlider.prototype.left = function () { this.activate(this.current-1); }
  window.GatoSlider.prototype.right = function () { this.activate(this.current+1); }
  window.GatoSlider.prototype.activate = function(index) {
    var slider = this;
    var size = slider.slides.length;

    // figure this out before wrapping so that we still slide from the correct direction
    var slidefromright = index > slider.current;

    if (index < 0) index = index % size == 0 ? 0 : size + index % size;
    else index = index % size;
    if (index == slider.current) return;
    var curr = slider.slides.eq(slider.current);
    var next = slider.slides.eq(index);
    if (slidefromright) { // sliding from the right
      next.velocity({left: ['0%','100%']}, {duration: 150});
      curr.velocity({left: ['-100%','0%']}, {duration: 150});
    } else { // sliding from the left
      next.velocity({left: ['0%','-100%']}, {duration: 150});
      curr.velocity({left: ['100%','0%']}, {duration: 150});
    }
    slider.current = index;
  }
})(jQuery);
