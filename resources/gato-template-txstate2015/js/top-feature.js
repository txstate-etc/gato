jQuery(function($) {
  $('.slide-nav a').blurclick(function(e) {
    var $next, $cur = $(this).parent().prev('.slides').find('.slide:visible');
    if ($(this).hasClass('slide-nav-left')) {
      $next = $cur.prev();
      if (!$next.length) {
        $next = $cur.siblings().last();
      }
    } else {
      $next = $cur.next();
      if (!$next.length) {
        $next = $cur.siblings().first();
      }
    }

    $cur.fadeOut(100, function(){
        $next.fadeIn(100);
    });
    //$next.fadeIn(150);

  });
});
