jQuery(function($) {
    
  var vmodal = {
    isOpen: false,
    $slides: null,
    $cur: null,

    loadSlide: function($slide) {
      var dataEmbed = $slide.find('.feature-play-button a').attr('data-embed');
      var dataUrl = $slide.find('.feature-play-button a').attr('href');
      var $container = $('<div class="gatoEmbedContainer" data-url="' + dataUrl + '" data-embed=\''+ dataEmbed +'\'></div>');
      $('#video-modal .video-container').empty().append($container);
      createPlayer($container, dataUrl, { autoplay: true });
      this.$cur = $slide;
    },

    open: function($slide, $slides) {
      this.isOpen = true;
      this.$slides = $slides;
      if ($slides.length > 1) {
        $('.video-nav').show();
      } else {
        $('.video-nav').hide();
      }
      this.loadSlide($slide);
      $('#video-modal').fadeIn(150);
    },

    close: function() {
      $('#video-modal').fadeOut(150);
      $('#video-modal .video-container').empty();
      this.isOpen = false;
    }
  };

  $('.feature-play-button a').blurclick(function(e) {
    var $slide = $(this).closest('.slide');
    // get list of siblings that have videos
    var $slides = $slide.parent().find('.feature-play-button').closest('.slide').not('.slick-cloned');
    vmodal.open($slide, $slides);
  });

  $('.video-nav a').blurclick(function(e) {
    e.stopPropagation();

    var idx = vmodal.$slides.index(vmodal.$cur);

    if ($(this).hasClass('video-nav-left')) {
      idx--;
      if (idx < 0) {
        idx = vmodal.$slides.length - 1;
      }
    } else {
      idx++;
      if (idx > vmodal.$slides.length - 1) {
        idx = 0;
      }
    }

    vmodal.loadSlide($(vmodal.$slides[idx]));
  });

  $('#video-modal .video-modal-close').blurclick(vmodal.close);
  $('#video-modal').on('click', vmodal.close);
  $(window).on('keydown', function(e) {
    if (vmodal.isOpen && e.keyCode == 27) {
      vmodal.close();
    }
  });

});