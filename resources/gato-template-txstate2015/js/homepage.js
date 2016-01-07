jQuery(function($) {

  // top banner
  $('.homepage-banner-nav').scrollToFixed();
  
  var curAudienceLink = false;
  var menutimeout = null;
  function resetMenuTimeout() {
    if (menutimeout) {
      clearTimeout(menutimeout);
      menutimeout = null;
    }
  }

  function showMenu($tab) {
    // hide all, then show selected
    hideMenus(true);

    var $content = $('#'+$tab.attr('aria-controls'));
    $content.fadeIn(150);

    $tab.attr('aria-selected', true).attr('tabindex', 0);
    $content.attr('aria-hidden', false);
    curAudienceLink = $tab.get(0);
  }

  function hideMenus(cleartabidx) {
    curAudienceLink = false;
    $('.audience-link-section[role=menu]:visible').fadeOut(150);
    $('.audience-link-section[role=menu]').attr('aria-hidden', true);
    var $tabs = $('li a[role=menuitem]');
    $tabs.attr('aria-selected', false);
    if (cleartabidx) {
      $tabs.attr('tabindex', -1);
    }
  }

  function delayHideMenus() {
    resetMenuTimeout();
    menutimeout = setTimeout(function() {
      hideMenus();
    }, 150);   
  }

  var $audienceLinks = $('.audience-link-tabs li a[role=menuitem]');
  $audienceLinks.on('mouseenter click', function(e) {
    if (detect_touch() && e.target != curAudienceLink) {
      e.preventDefault();
    }
    console.log('audience link mouseenter');
    resetMenuTimeout();
    var $tab = $(this);
    menutimeout = setTimeout(function() {
      showMenu($tab);
    }, 100);
  }).on('mouseleave', delayHideMenus)
  .on('keydown', function(e) {
    var key = e.keyCode;

    // return if not an arrow key    
    if (key < 37 || key > 40) {
      return true;
    }
    
    e.preventDefault();
    
    if (key == 38) { 
      hideMenus();
      return false;
    }

    if (key == 40) { // down => open menu
      if ($(this).attr('aria-selected') !== 'true') {
        showMenu($(this));
      }
      return false;
    }

    var $next, $cur = $(this).parent();
    if (key == 37 ) { // left == prev 
      $next = $cur.prev();
      if (!$next.length) {
        $next = $cur.siblings().last();
      }
    } else if (key == 39) { // right == next
      $next = $cur.next();
      if (!$next.length) {
        $next = $cur.siblings().first();
      }
    } 
    
    $next = $next.find('a[role=menuitem]');
    $next.attr('tabindex', 0).focus();
    $(this).attr('tabindex', -1);
    // if a menu is currently open, open $next as well;
    if ($(this).attr('aria-selected') === 'true') {
      showMenu($next);      
    }
    return false;

  });
  
  var $audienceLinkSections = $('.audience-link-section[role=menu]')
  .on('mouseenter focusin', resetMenuTimeout)
  .on('mouseleave focusout', delayHideMenus);

  $(document).on('touchend', function (e) {
    if (!$audienceLinks.is(e.target) && !$audienceLinkSections.is(e.target) && !$audienceLinkSections.has(e.target).length) {
      delayHideMenus();
    }
  });

  // Top Slider
  var topSliderDesktop = {opacity: "1", left: "auto"};
  var topSliderMobile = {opacity: "1", left: "0"};
  var topSliderFirstCss = {opacity: "1"};
  var $topSliderFirst = $('#top-feature').find('.slide:first-child figure .img-wrap, .slide-nav');
  var $topSlider = $('#top-feature .slides');
  var $topSlides = $topSlider.find('.slide');
  function animateTopSlider(idx, delay) {
    var $caption = $topSlides.eq(idx).find('.caption-wrap');
    
    var pos = $caption.position();
    if (!pos || isNaN(pos.left)) {
      console.log("Can't get position of caption");
      $caption.css(topSliderDesktop);
      return;
    }

    $caption.css({
      opacity: "0",
      left: (pos.left - 30)
    });

    var style = $.extend({}, topSliderDesktop, {left: pos.left});

    var $anim = $caption;
    if (delay) {
      $anim = $caption.delay(delay);
    }
    $anim.animate(style, 750, 'swing', function() {
      $caption.css(topSliderDesktop);
    });
  }
  $topSlider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
    if (slick.getOption('fade') === true) {
      var $el = $topSlides.eq(nextSlide).find('.caption-wrap');
      animateTopSlider(nextSlide, 500);

    }
  }).on('breakpoint', function(event, slick, breakpoint){
    var $el = $topSlides.find('.caption-wrap');
    if (slick.getOption('fade') === true) {
      $topSliderFirst.css(topSliderFirstCss);
      $el.css(topSliderDesktop);
    } else {
      $el.css(topSliderMobile);
    }
  }).slick({
    dots: false,
    adaptiveHeight: false,
    autoplay: false,
    appendArrows: $('#top-feature .slide-nav'),
    arrows: true,
    fade: true,
    swipe: false,
    speed: 700,
    responsive: [
      {
        breakpoint: 800, // cf. max-width: $sm-breakpoint
        settings: {
          adaptiveHeight: true,
          arrows: false,
          fade: false,
          swipe: true,
        }
      }
    ]
  });
  if ($topSlider.slick('slickGetOption', 'fade') === true) {
    $topSliderFirst.delay(500).animate(topSliderFirstCss, 700);
    animateTopSlider(0, 750);
  }

  // Research Slider
  $('.research .slides').slick({
    dots: true,
    arrows: true,
    adaptiveHeight: false,
    autoplay: false,
    appendArrows: $('.research .slide-nav')
  });

  // twitter
  function advanceTweet(dur) {
    var $cur = $('#social .twitter .slide:visible');
    var $next = $cur.next();
    if (!$next.length) {
      $next = $cur.siblings().first();
    }

    $('#social .twitter .social-lower .twitter-timestamp').fadeOut(dur, function(){
      $(this).html($next.find('.timestamp').clone()).fadeIn(dur);
    });
    $cur.fadeOut(dur, function(){
        $next.fadeIn(dur);
    });
  }

  var tweettimeout = null;
  function resetTweetTimeout() {
    if (tweettimeout) {
      clearTimeout(tweettimeout);
      tweettimeout = null;
    }
  }

  function autoAdvanceTweet() {
    resetTweetTimeout();
    tweettimeout = setInterval(function() {
      advanceTweet(500);
    }, 5000);
  }

  // Clicking anywhere on a tweet that's not a link should advence the slides.
  // FIXME: make this accessible (like Tabs?)
  $('#social .twitter .social-upper a').click(function(e) {
    e.stopPropagation();
  });
  $('#social .twitter .social-upper').blurclick(function(e) {
    resetTweetTimeout();
    advanceTweet(200);
  }).on('mouseenter', resetTweetTimeout).on('mouseleave', autoAdvanceTweet);
  autoAdvanceTweet();

  // videos
  var vmodal = {
    isOpen: false,
    $slides: null,
    $cur: null,

    loadSlide: function($slide) {
      var $container = $('<div class="gatoEmbedContainer"></div>');
      $('#video-modal .video-container').empty().append($container);
      createPlayer($container, $slide.find('.feature-play-button a').attr('href'), { autoplay: true });    
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
    var $slides = $slide.parent().find('.feature-play-button').closest('.slide');
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
