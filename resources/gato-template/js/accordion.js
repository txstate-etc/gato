(function($) {
  var accordion_dur = 150;
  window.accordion = {
    show : function ($hdr, options) {
      options = options || {};
      var $parent = $hdr.parent();
      var $panel = $hdr.next();
      var $lnk = $hdr.find('a');
      $parent.addClass('shown');
      $lnk.attr('aria-expanded', true);
      if (options.instant) {
        $panel.show();
      } else {
        $panel.velocity('slideDown', { duration: accordion_dur });
      }
    },

    hide : function($hdr, options) {
      options = options || {};
      var $parent = $hdr.parent();
      var $panel = $hdr.next();
      var $lnk = $hdr.find('a');
      $parent.removeClass('shown');
      $lnk.attr('aria-expanded', false);
      if (options.instant) {
        $panel.hide();
      } else {
        $panel.velocity('slideUp', { duration: accordion_dur });
      }
    },

    toggle : function($hdr) {
      var $parent = $hdr.parent();
      if ($parent.hasClass('shown')) window.accordion.hide($hdr);
      else window.accordion.show($hdr);
    }
  }

  $(function() {
    window.accordion.hide($('.gato-accordion[data-start-collapsed=true] .gato-accordion-header'), {instant: true});
    window.accordion.show($('.gato-accordion[data-start-collapsed=false] .gato-accordion-header'), {instant: true});

    $('.gato-accordion-header').on('click', function(e) {
      e.preventDefault();
      window.accordion.toggle($(this));
    });

    $('#gato-accordion-expand-all').on('click', function(e) {
      e.preventDefault();
      window.accordion.show($('.gato-accordion-header'));
    });

    $('#gato-accordion-collapse-all').on('click', function(e) {
      e.preventDefault();
      window.accordion.hide($('.gato-accordion-header'));
    });

    // if the url contains an anchor that lives inside an faq, let's open the FAQ to that item
    if (document.location.hash.match(/^#[a-z][\w\-\:\.]*$/i)) {
      $('.gato-accordion-content '+document.location.hash+', .gato-accordion-content [name="'+document.location.hash.slice(1)+'"]').each(function (i, ele) {
        var $lis = $(ele).parents('.gato-accordion');
        var $lnks = $lis.find('> .gato-accordion-header');
        window.accordion.show($lnks, {instant: true});
      });
    }
  });
})(jQuery);
