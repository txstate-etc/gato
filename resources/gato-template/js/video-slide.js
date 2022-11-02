jQuery(function($) {

  var vmodal = {
    isOpen: false,
    $slides: null,
    $cur: null,

    loadSlide: function($lnk) {
      var dataEmbed = $lnk.data('embed') || '';
      var dataWidth = $lnk.data('embedwidth') || NaN;
      var dataHeight = $lnk.data('embedheight') || NaN;
      var noAspect = typeof dataWidth === 'string' && dataWidth.includes('%');
      if (!noAspect && (isNaN(Number(dataWidth)) || isNaN(Number(dataHeight)))) {
        dataWidth = '1280'
        dataHeight = '720'
      }
      var padBottom = noAspect ? '0%' : (100.0 * Number(dataHeight) / Number(dataWidth)) + '%';

      // special treatment for youtube and vimeo to autoplay when the modal appears
      dataEmbed = dataEmbed.replace(/src="(.*?youtube\.com.*?)"/i, 'src="$1&autoplay=1"');
      if (dataEmbed.indexOf('?') !== -1) dataEmbed = dataEmbed.replace(/src="(.*?vimeo\.com.*?)"/i, 'src="$1&autoplay=1"');
      else dataEmbed = dataEmbed.replace(/src="(.*?vimeo\.com.*?)"/i, 'src="$1?autoplay=1"');
      dataEmbed = dataEmbed.replace(/src="(.*?mediaflo\.txstate\.edu.*?autoPlay=)\w+(.*?)"/i, 'src="$1true$2"');
      dataEmbed = dataEmbed.replace(/src="(.*?yuja\.com.*?)"/, 'src="$1&autostart=1"').replace(/&preload=false/, '');
      dataEmbed = dataEmbed.replace(/src="(.*?facebook\.com.*?)"/i, 'src="$1&autoplay=true"');

      var dataUrl = $lnk.attr('href');
      var $container = $('<div class="gatoEmbedContainer' + (noAspect ? ' noAspect' : '') + '" style="padding-bottom: ' + padBottom + '" data-url="' + dataUrl + '" data-embed=\''+ dataEmbed +'\'></div>');
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
      if (this.$cur)
        this.$cur.focus();
      this.isOpen = false;
    }
  };

  $('.feature-play-button a, a.feature-play-button').blurclick(function(e) {
    var $lnk = $(this);
    // get list of siblings that have videos
    var $slides = $lnk.closest('.gato-slider, .slides').find('.slide:not(.slick-cloned)').find('.feature-play-button a, a.feature-play-button');
    vmodal.open($lnk, $slides);
    $('#video-modal .video-modal-close').focus();
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

  $('#video-modal .video-modal-close').blurclick(function(e) {
    vmodal.close();
  });
  $('#video-modal').on('click', function (e) {
    if ($(e.target).closest('.video-container').length == 0) vmodal.close();
  });
  $(window).on('keydown', function(e) {
    if (vmodal.isOpen && e.keyCode == 27) {
      vmodal.close();
    }
  });

  $('.vmodal-container').focusout(function (e) {
    var tabbable = $('.vmodal-container').find(':tabbable');
    var first = tabbable.first();
    var last = tabbable.last();
    var targ = $(e.relatedTarget);
    if (targ.is('.vmodal-focusstart')) {
      last.focus();
    }
    else if (targ.is('.vmodal-focusend')) {
      first.focus();
    }
  })
});
