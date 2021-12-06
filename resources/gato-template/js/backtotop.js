jQuery(document).ready(function($) {
  var scrollTimer;
  var prevST = 0;
  var bttButton = $('#backtotop');

  var toggleBackToTop = function() {
    var st = $(this).scrollTop();
    if (st > 500 && st < prevST) {
      bttButton.show();
    }
    else {
      bttButton.hide();
    }
    prevST = st;
  }
  $(window).scroll(function(){
    if (scrollTimer) {
      cancelanimationframe(scrollTimer)
    }
    scrollTimer = animationframe(toggleBackToTop)
  });
  toggleBackToTop()

  bttButton.click(function(e) {
    $('body').velocity('scroll', { offset: 0, mobileHA: false });
  })
})