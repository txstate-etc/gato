jQuery(document).ready(function($) {
  $('.event-details').click(function(e){
    e.preventDefault();
    window.accordion.toggle($(this));
  });

  var hide_event = function($evt) {
    animationframe(function() {
      $evt.hide();
      $evt.attr('aria-hidden', true);
    });
  }
  var show_event = function($evt) {
    animationframe(function() {
      $evt.show();
      $evt.attr('aria-hidden', false);
    });
  }

  var evaluate = function() {
    $catslct = $('.wittliff-event-filters select[name="category"]');
    $monthslct = $('.wittliff-event-filters select[name="month"]');
    $('.wittliff-event-list .event').each( function () {
      var $evt = $(this);
      var filtered = false;

      if (!isBlank($catslct.val()) && !$evt.data('categories').includes($catslct.val())) filtered = true;
      if (!isBlank($monthslct.val()) && $evt.data('month-key') != $monthslct.val()) filtered = true;

      if (filtered) hide_event($evt);
      else show_event($evt);
    });
  }

  $('.wittliff-event-filters select').change(function (e) {
    evaluate();
  });
});
