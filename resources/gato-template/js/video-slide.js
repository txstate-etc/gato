jQuery(function($) {

  var vmodal = {
    isOpen: false,
    $slides: null,
    $cur: null,

    loadSlide: function($lnk) {
      var dataEmbed = $lnk.data('embed');

      // special treatment for youtube and vimeo to autoplay when the modal appears
      var dataEmbed = dataEmbed.replace(/src="(.*?youtube\.com.*?)"/i, 'src="$1&autoplay=1"');
      var dataEmbed = dataEmbed.replace(/src="(.*?vimeo\.com.*?)"/i, 'src="$1?autoplay=1"');
      var dataEmbed = dataEmbed.replace(/src="(.*?mediaflo\.txstate\.edu.*?autoPlay=)\w+(.*?)"/i, 'src="$1true$2"');

      var dataUrl = $lnk.attr('href');
      var $container = $('<div class="gatoEmbedContainer" data-url="' + dataUrl + '" data-embed=\''+ dataEmbed +'\'></div>');
      $('#video-modal .video-container').empty().append($container);
      createPlayer($container, dataUrl, { autoplay: true });
      this.$cur = $lnk;
    },

    open: function($lnk, $slides) {
      this.isOpen = true;
      this.$slides = $slides;
      if ($slides.length > 1) {
        $('.video-nav').show();
      } else {
        $('.video-nav').hide();
      }
      this.loadSlide($lnk);
      $('#video-modal').fadeIn(150);
    },

    close: function() {
      $('#video-modal').fadeOut(150);
      $('#video-modal .video-container').empty();
      this.isOpen = false;
    }
  };

  $('.feature-play-button a, a.feature-play-button').blurclick(function(e) {
    var $lnk = $(this);
    // get list of siblings that have videos
    var $slides = $lnk.closest('.gato-slider, .slides').find('.slide:not(.slick-cloned)').find('.feature-play-button a, a.feature-play-button');
    vmodal.open($lnk, $slides);
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

    vmodal.loadSlide(vmodal.$slides.eq(idx));
  });

  $('#video-modal .video-modal-close').blurclick(vmodal.close);
  $('#video-modal').on('click', function (e) {
    if ($(e.target).closest('.video-container').length == 0) vmodal.close();
  });
  $(window).on('keydown', function(e) {
    if (vmodal.isOpen && e.keyCode == 27) {
      vmodal.close();
    }
  });

});
