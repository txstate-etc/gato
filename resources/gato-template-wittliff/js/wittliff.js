jQuery(document).ready(function($) {
  // Editing environment text changes
  magnolialabelchange('.menu-social-media', '.mgnlEditor.mgnlPlaceholder', 'Add Social Media');
  magnolialabelchange('.menu-newsletter-button', '.mgnlEditor.mgnlPlaceholder', 'Add Newsletter Button');
  magnolialabelchange('.menu-donate-button', '.mgnlEditor.mgnlPlaceholder', 'Add Donate Button');
  magnolialabelchange('.calltoaction-column', '.mgnlEditor.mgnlPlaceholder', 'Add Button');

  // Main Menu Hamburger Button
  var header = $('.page-header');
  var menucontainer = $('.main-menu');
  var menubtn = $('.main-menu >button');
  var menupanel = $('.main-menu .main-menu-panel');
  var menuhide = function () {
    header.removeClass('menu-out');
    menubtn.attr('aria-expanded', false);
    menupanel.velocity('slideUp', { duration: 150 });
  }
  var menushow = function() {
    header.addClass('menu-out');
    menubtn.attr('aria-expanded', true);
    menupanel.velocity('slideDown', { duration: 150 });
  }
  menubtn.click(function (e) {
    if (header.hasClass('menu-out')) menuhide();
    else menushow();
  })
  $('html').click( function (e) {
    if (!$.contains(menucontainer.get(0), e.target)) {
      menuhide();
    }
  });
  // close the menu with the escape key
  $(document).keyup(function (e) {
    if (e.keyCode === 27 && header.hasClass('menu-out')) {
      e.preventDefault();
      menuhide();
    }
  });

  // Main Menu expand/contract
  $('.simplemenu-expand').click(function (e) {
    var btn = $(this);
    var toplevel = btn.closest('li');
    var panel = toplevel.find('.simplemenu-subitems');
    toplevel.toggleClass('expanded');
    btn.attr('aria-expanded', toplevel.hasClass('expanded'));
    panel.velocity(toplevel.hasClass('expanded') ? 'slideDown' : 'slideUp', { duration: 150 });
  });


  // Stay Connected Button
  var smcontainer = $('.social-media');
  var smbtn = $('.social-media >button');
  var smpanel = $('.social-media .social-media-panel');
  var smtimeout;
  smbtn.click(function (e) {
    smcontainer.toggleClass('shown');
    smbtn.attr('aria-expanded', smcontainer.is('.shown'));
  })
  var smin = function() {
    clearTimeout(smtimeout);
    smtimeout = setTimeout(function() {
      smcontainer.addClass('shown');
      smbtn.attr('aria-expanded', true);
    }, 100);
  }
  var smout = function() {
    clearTimeout(smtimeout);
    smtimeout = setTimeout(function() {
      smcontainer.removeClass('shown');
      smbtn.attr('aria-expanded', false);
    }, 200);
  }
  var smcancel = function() {
    if (smcontainer.hasClass('shown')) {
      clearTimeout(smtimeout);
    }
  }
  smbtn.mouseover(smin);
  smpanel.mouseover(smin);
  header.mouseover(smcancel);
  header.mouseout(smout);
  smpanel.mouseout(smout);
  $('html').click( function (e) {
    if (!$.contains(smcontainer.get(0), e.target)) {
      smcontainer.removeClass('shown');
      smbtn.attr('aria-expanded', false);
    }
  });

  // Hero Slider
  $('.gato-heroslider').each(function (idx, itm) {
    var slider = $(itm);
    var slides = slider.find('.slide');
    var active = 0;
    var setactive = function (slideidx) {
      var currslide = slides.eq(active);
      var nextslide = slides.eq(slideidx);
      if (currslide.is(nextslide)) return;
      currslide.velocity({ left: ['-100%', '0%'] }, {duration: 500});
      nextslide.velocity({ left: ['0%', '100%'] }, {duration: 500});
      active = slideidx;
    };
    var advance = function () {
      setactive((active+1) % slides.length);
    }
    var timer = 0;
    if (slider.is('.slow')) timer = 30;
    else if (slider.is('.medium')) timer = 20;
    else if (slider.is('.fast')) timer = 10;
    if (timer > 0) {
      setInterval(advance, timer*1000);
    }
  });
  $('.gato-heroslider .slide:not(:first-child)').each(function (idx, itm) {
    var slide = $(itm);
    var img = slide.find('img');
    img.attr('src', slide.data('src')).attr('srcset', slide.data('srcset'));
  });

  // Make sure the footer is at the bottom of the window when the
  // page is shorter than one window
  var win = $(window);
  var header = $('.page-header');
  var footer = $('.page-footer');
  var herobanner = $('.gato-heroslider, .gato-herobanner');
  var pagecontent = $('.page_content');
  var pagecontentheightfix = function () {
    pagecontent.css('min-height', win.height() - header.outerHeight(true) - herobanner.outerHeight(true) - footer.outerHeight(true) - pagecontent.outerHeight(true) + pagecontent.outerHeight() - 1);
  }
  resizeTimeout(pagecontentheightfix);
  waitforselector('.navBlocks_add', '.mgnlEditor.mgnlPlaceholder', pagecontentheightfix);

  // Code to ensure blocks of text never go over a certain number of lines
  function fontresizer() {
    this.reads = [];
  }
  fontresizer.prototype.queue = function (read) {
    this.reads.push(read);
  }
  fontresizer.prototype.execute = function () {
    var writes = [];
    for (var i = 0; i < this.reads.length; i++) writes.push(this.reads[i]());
    for (var i = 0; i < writes.length; i++) writes[i]();
    this.reads = [];
  }
  var resizer = new fontresizer();

  var optimize = function () {
    var $watched = $('[data-max-lines]');
    var done = 0;
    var target = $watched.length;

    $watched.each(function (idx, itm) {
      var $itm = $(itm);
      $itm.css('font-size', '');
      $itm.data('max-lines-top', parseInt($itm.css('font-size'), 10));
      $itm.data('max-lines-bottom', 0);
      $itm.data('max-lines-done', false);
    });
    for (var i = 0; i < 20 && done < target; i++) {
      $watched.each(function (idx, itm) {
        var $itm = $(itm);

        var iterate = function () {
          var currentlines = Math.round($itm.height() / parseInt($itm.css('line-height'), 10));
          var currentsize = parseInt($itm.css('font-size'), 10);
          var newsize;
          if (currentlines <= $itm.data('max-lines')) {
            $itm.data('max-lines-bottom', currentsize);
            newsize = (currentsize + $itm.data('max-lines-top')) / 2;
            if (Math.abs(newsize - currentsize) <= 1) {
              newsize = currentsize;
            }
          } else {
            $itm.data('max-lines-top', currentsize);
            newsize = (currentsize + $itm.data('max-lines-bottom')) / 2;
            if (Math.abs(newsize - currentsize) <= 1) newsize = $itm.data('max-lines-bottom');
          }

          if (newsize != currentsize) return function () {
            $itm.css('font-size', newsize+'px');
          }
          // above us is a 'return'
          // if we make it this far we have no more work to do
          $itm.data('max-lines-done', true);
          done++;
          return function () { }
        }
        if (!$itm.data('max-lines-done')) resizer.queue(iterate);
      });
      resizer.execute();
    }
  }
  resizeTimeout(optimize);


});
