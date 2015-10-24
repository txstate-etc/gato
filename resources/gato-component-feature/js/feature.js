var gatofeature = function(featureparent) {
  var ftr = this;
  ftr.parent = jQuery(featureparent);
  ftr.slides = ftr.parent.find('.slide').map(function(i,ele) { return jQuery(ele); }).get();
  ftr.left = ftr.parent.find('.navleft');
  ftr.right = ftr.parent.find('.navright');
  ftr.pages = ftr.parent.find('.pages li').map(function(i,ele) { return jQuery(ele); }).get();
  ftr.activeidx = 0;
  ftr.slidecount = ftr.slides.size();
  ftr.left.blurclick(function () { ftr.prev(); });
  ftr.right.blurclick(function () { ftr.next(); });
  ftr.parent.find('.slide').click(function (e) {
    var slide = jQuery(this);
    var href = slide.attr('data-feature-link');
    if (href) window.location = href;
  });
  ftr.parent.find('.pages a').blurclick(function (e) {
    var pi = jQuery(this);
    var idx = pi.attr('data-feature-index');
    ftr.activate(idx);
  });
};

gatofeature.prototype.slide = function(idx) {
  var ftr = this;
  return ftr.slides[idx];
}

gatofeature.prototype.page = function(idx) {
  var ftr = this;
  return ftr.pages[idx];
}

gatofeature.prototype.next = function() {
  var ftr = this;
  ftr.activate(ftr.activeidx+1);
}

gatofeature.prototype.prev = function() {
  var ftr = this;
  ftr.activate(ftr.activeidx-1, true);
}

gatofeature.prototype.activate = function(activateindex, isprev) {
  var ftr = this;
  var idx = activateindex % ftr.slidecount;
  if (idx < 0) idx += ftr.slidecount;
  if (ftr.activeidx == idx) return;
  var curr = ftr.slide(ftr.activeidx);
  var next = ftr.slide(idx);
  var currpi = ftr.page(ftr.activeidx);
  var nextpi = ftr.page(idx);
  var saveactive = ftr.activeidx;
  animQueue('feature', function(qnext) {
    // if the prev() method triggered this activate, we want to slide in from the
    // left, so a little logic is required here
    var nextleftstart = next.width();
    var currleftend = -1*curr.width();
    if (isprev) {
      nextleftstart *= -1;
      currleftend *= -1;
    }

    // instant CSS changes to set up for the animation
    ftr.parent.css('padding-top', Math.max(curr.height(), next.height())+'px');
    curr.css({'margin': '0px', 'position': 'absolute', 'top': '0px', 'left': '0px'});
    next.css({'margin': '0px', 'position': 'absolute', 'top': '0px', 'left': nextleftstart+'px', 'display': 'block'});

    // start the animation and return a jQuery.Deferred() to animQueue
    return jQuery.when(
      next.velocity({'left': '0px'}, 250),
      curr.velocity({'left': currleftend+'px'}, 250)
    );
  }, function() { // successfully added to queue
    ftr.activeidx = idx;
  }).done(function () {
    // tear down the animation after it has completed
    next.css({'margin': '', 'position': '', 'top': '', 'left': '', 'display':''});
    curr.css({'margin': '', 'position': '', 'top': '', 'left': ''});
    curr.removeClass('active');
    next.addClass('active');
    currpi.removeClass('active');
    nextpi.addClass('active');
    ftr.parent.css('padding-top', '');
  });
}

jQuery(document).ready(function ($) {
  $('.gato-feature').each(function(i, feature) {
    new gatofeature(feature);
  });
});
