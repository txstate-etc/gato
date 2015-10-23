(function($) {
  var accordion_dur = 150;

  $(function() {
    $('.gato-accordion[data-start-collapsed=true] .gato-accordion-content').hide();

    $('.gato-accordion h3 a').on('click', function(e) {
      e.preventDefault();
      var content = $(this).parent().next('.gato-accordion-content');
      $(content).slideToggle(accordion_dur);
    });

    $('#gato-accordion-expand-all').on('click', function(e) {
      e.preventDefault();
      $('.gato-accordion-content').slideDown(accordion_dur);
    });

    $('#gato-accordion-collapse-all').on('click', function(e) {
      e.preventDefault();
      $('.gato-accordion-content').slideUp(accordion_dur);
    });

  });
})(jQuery);
