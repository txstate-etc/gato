jQuery(function($) {

  function activate($tab) {
    var $content = $('#'+$tab.attr('aria-controls'));

    var $cur = $('div[role=tabpanel]:visible');
    if ($cur.length) {
      $cur.fadeOut(75, function(){
        $content.fadeIn(75);
      });
    } else {
      $content.fadeIn(75);
    }

    // hide all, then show selected
    $('li a[role=tab]').attr('aria-selected', false).attr('tabindex', -1);
    $('div[role=tabpanel]').attr('aria-hidden', true);

    $tab.attr('aria-selected', true).attr('tabindex', 0);
    $content.attr('aria-hidden', false);
  };

  $('li a[role=tab]').on('click', function(e) {
    e.preventDefault();
    this.blur();
    activate($(this));
  }).on('keydown', function(e) {
    var key = e.keyCode;

    // return if not an arrow key    
    if (key < 37 || key > 40) {
      return true;
    }
    
    e.preventDefault();
    
    var $next, $cur = $('li a[role=tab][aria-selected=true]').closest('li');
    if (key <= 38 ) { // left, up == prev 
      $next = $cur.prev();
      if (!$next.length) {
        $next = $cur.siblings().last();
      }
    } else { // right, down == next
      $next = $cur.next();
      if (!$next.length) {
        $next = $cur.siblings().first();
      }
    }
    
    $next = $next.find('a[role=tab]');
    $next.focus();
    activate($next);
  });

});
