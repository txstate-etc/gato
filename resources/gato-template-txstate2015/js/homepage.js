jQuery(function($) {

  // top banner
  $('.homepage-banner-nav').scrollToFixed();
  
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
  }

  function hideMenus(cleartabidx) {
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

  $('.audience-link-tabs li a[role=menuitem]').on('mouseover', function(e) {  
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

  $('.audience-link-section[role=menu]')
  .on('mouseenter focusin', resetMenuTimeout)
  .on('mouseleave focusout', delayHideMenus);

  // feature paragraphs
  function activateFeature($cur, $next) {
    $cur.fadeOut(100, function(){
        $next.fadeIn(100);
    });
    
    var $dots = $cur.parent().siblings('.slide-nav-dots').find('a');
    $dots.eq($cur.index()).removeClass('active-dot');
    $dots.eq($next.index()).addClass('active-dot');
  }

  $('.slide-nav a').blurclick(function(e) {
    var $next, $cur = $(this).closest('.feature').find('.slides .slide:visible');

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

    activateFeature($cur, $next);

  });
  
  $('.slide-nav-dots a').blurclick(function(e) {
    var $slides = $(this).parent().siblings('.slides');
    var $cur = $slides.find('.slide:visible');
    var $next = $slides.find('.slide').eq($(this).index());
    activateFeature($cur, $next);
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
  }).on('mouseover', resetTweetTimeout).on('mouseleave', autoAdvanceTweet);
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
