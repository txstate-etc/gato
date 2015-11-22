jQuery(function($) {

  function activate($cur, $next) {
    $cur.fadeOut(100, function(){
        $next.fadeIn(100);
    });
    
    var $dots = $cur.parent().siblings('.slide-nav-dots').find('a');
    $dots.eq($cur.index()).removeClass('active-dot');
    $dots.eq($next.index()).addClass('active-dot');
  }

  $('.slide-nav a').blurclick(function(e) {
    var $next, $cur = $(this).parent().siblings('.slides').find('.slide:visible');

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

    activate($cur, $next);

  });
  
  $('.slide-nav-dots a').blurclick(function(e) {
    var $slides = $(this).parent().siblings('.slides');
    var $cur = $slides.find('.slide:visible');
    var $next = $slides.find('.slide').eq($(this).index());
    activate($cur, $next);
  });
});
