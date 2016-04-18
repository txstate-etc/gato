(function($) {
  var accordion_dur = 150;

  $(function() {
    $('.gato-accordion[data-start-collapsed=true] .gato-accordion-content').hide();
    $('.gato-accordion[data-start-collapsed=true] .gato-accordion-header').removeClass('selected');
    $('.gato-accordion[data-start-collapsed=false] .gato-accordion-header').addClass('selected');

    $('.gato-accordion-header').on('click', function(e) {
      e.preventDefault();
      $(this).toggleClass('selected');
      $(this).next('.gato-accordion-content').slideToggle(accordion_dur);
    });

    $('.gato-accordion-expand-all').on('click', function(e) {
      e.preventDefault();
      var $accordions = $(this).closest('.gato-accordion-expand-collapse').parent().find('.gato-accordion');
      $accordions.find('.gato-accordion-content').slideDown(accordion_dur);
      $accordions.find('.gato-accordion-header').addClass('selected');
    });

    $('.gato-accordion-collapse-all').on('click', function(e) {
      e.preventDefault();
      var $accordions = $(this).closest('.gato-accordion-expand-collapse').parent().find('.gato-accordion');
      $accordions.find('.gato-accordion-content').slideUp(accordion_dur);
      $accordions.find('.gato-accordion-header').removeClass('selected');
    });

  });
})(jQuery);
