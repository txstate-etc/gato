jQuery(document).ready(function($) {
  var jqwindow = jQuery(window);
  var headerimage = $(".bg_image, .bg_image_secondary");
  if (headerimage.length > 0) {
    // Parallax scrolling effect
    var headerbg = headerimage.get(0);
    var topoffset = headerimage.position().top;
    var lastscroll = 0;
    var lasttop = 0;
    var parallax = function () {
      var scrollY = jqwindow.scrollTop();
      if (lastscroll != scrollY) {
        var newtop = Math.round(scrollY * .6);
        if (lasttop != newtop) {
          if (cssTransform) {
            headerbg.style[cssTransform] = "translate3d(0, "+ newtop +"px,0)";
          } else {
            headerbg.style.top = (topoffset + newtop) + "px";
          }
          lasttop = newtop;
        }
        lastscroll = jqwindow.scrollTop();
      }
      animationframe(parallax);
    }
    animationframe(parallax);


    // Background image delay and fade
    var himg = headerimage.find('img');
    himg.afterload(function() {
      // Background image ensure big enough
      resizeTimeout(function () {
        var imgh = himg.height();
        var imgw = himg.width();
        var ar = (1.0*imgw) / imgh;
        var minw = headerimage.width();
        var minh = headerimage.height();
        var newh = Math.max(Math.ceil(minw / ar), minh);
        var neww = Math.ceil(newh*ar);
        himg.css('top', ((minh-newh)/2)+'px');
        himg.css('left', ((minw-neww)/2)+'px');
        himg.css('width', neww+'px');
        himg.css('height', newh+'px');
      });
      headerimage.delay(100).velocity({opacity: "1"}, 500);
    });
  }
});

jQuery(document).ready(function($) {

  // Fixed desktop navigation
  var $navcontainer = $('.top_nav');
  var $menu = $('.top_nav .ddmenu-bg');
  var $window = $(window);
  var navfixed = function () {
    var offsettop = $navcontainer.offset().top;
    var top = ($window.scrollTop() || $("body").scrollTop());

    if (offsettop >= top) {
      if ($navcontainer.hasClass('scroll-to-fixed-fixed')) {
        $navcontainer.css('height', '');
        $navcontainer.removeClass('scroll-to-fixed-fixed');
      }
    } else if (!$navcontainer.hasClass('scroll-to-fixed-fixed')) {
      var navh = $navcontainer.height();
      $navcontainer.css('height', navh+'px');
      $navcontainer.addClass('scroll-to-fixed-fixed');
    }
  }
  if ($navcontainer.length > 0) {
    resizeTimeout(navfixed);
    $(window).scroll(function () {
      var timer = animationframe(function () {
        cancelanimationframe(timer);
        navfixed();
      });
    });
  }

  // Back to top
  jQuery('.btt').on("click", function(e) {
    e.preventDefault();
    jQuery('html').velocity('scroll', { duration: 500 });
  });

  //animate scrolling to anchors and make sure they don't hide behind sticky nav
  //adapted from https://css-tricks.com/snippets/jquery/smooth-scrolling/
  $('.column_paragraph a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $('[id="' + decodeURI(this.hash.slice(1)) +'"]');
      target = target.length ? target : $('[name="' + decodeURI(this.hash.slice(1)) +'"]');
      if (target.length) {
            if(history && history.pushState){
              history.pushState(null, null, location.pathname + this.hash);
            }
            else{
              window.location.hash = this.hash;
            }
            $(target).velocity('scroll', {
                duration: 500,
                complete: function() {
                  target.focus();
                  if (!target.is(":focus")) {
                    target.attr('tabindex', '-1');
                    target.focus();
                  }
                }
            });
        return false;
      }
    }
  });

  /*** SLIDEOUT MENU ***/
  var slideoutPadding = 300;
  //IE9 does not support window.matchMedia
  if (window.matchMedia && window.matchMedia("(max-width: 350px)").matches) {
    /* the viewport width <= 350px */
    slideoutPadding = 275;
  }
  if(!window.matchMedia){
    //since we can't decrease the slideout padding for IE9, don't make the menu smaller either
    jQuery('.slideout-menu').css("width", "300px");
  }
  var slideout = new Slideout({
    'panel': document.getElementById('panel'),
    'menu': document.getElementById('menu'),
    'padding' : slideoutPadding,
    'tolerance': 70,
    'side': 'right',
    'duration': 300,
    'touch': false
  });
  var toplevelitems = $('body > #panel, body > .skip-nav');
  var tabbables = toplevelitems.find('a, input, textarea');
  tabbables.each(function (idx, itm) {
    itm.slideout_save_tabindex = $(itm).attr('tabindex');
  });
  slideout.on('open', function () {
    $('.mobile_nav .mobile-page-title a').focus();
    toplevelitems.attr('aria-disabled', true);
    $('#menu').attr('aria-modal', true);
    tabbables.attr('tabindex', -1);
  });
  slideout.on('beforeclose', function () {
    $('.toggle-button').focus();
    toplevelitems.removeAttr('aria-disabled');
    $('#menu').removeAttr('aria-modal');
    tabbables.each(function (idx, itm) {
      if (isBlank(itm.slideout_save_tabindex)) $(itm).removeAttr('tabindex');
      else $(itm).attr('tabindex', itm.slideout_save_tabindex);
    });
  });
  jQuery('.toggle-button').on("click", function(e){
    e.preventDefault();
    slideout.toggle();
  });

  // close the menu if they click outside it
  $(document).on('click', function(e) {
    var targ = $(e.target);
    if (slideout.isOpen() && !targ.is('.toggle-button, .toggle-button .fa') && !targ.closest('#menu').length) {
      e.preventDefault();
      slideout.close();
    }
  });

  // close the menu with the escape key
  $(document).keyup(function (e) {
    if (e.keyCode === 27 && slideout.isOpen()) {
      e.preventDefault();
      slideout.close();
    }
  });
  /*** END SLIDEOUT MENU ***/

  //remove hover effect from rich editor image and font awesome links
  $('.column_paragraph a, .footer_content a, .txst-form a, .masonry-section .gato-card a').each(function(){
    if($(this).find('img, .fa').length > 0){
        $(this).addClass('link-with-children');
    }
  });

  //remove target="_blank" from rich editor, text/image, and FAQ content  but NOT raw html
  $('.column_paragraph a').each(function(){
    if($(this).attr('target') == "_blank" &&
       $(this).parents('.gato-html').length == 0) // == 0 means not inside raw html
      $(this).attr('target', "_self");
  });

  var timer;
  function resizeTitle(){
    var title = $('.dept_name .office_name a');
    var titleDiv = $('.office_name');
    if (!title.length || !titleDiv.length) return;
    var rem=$('html').css("font-size");
    var minFontSize = 2.8 * parseFloat(rem);
    var outerWidth = titleDiv.outerWidth();

    var scrollWidth = titleDiv[0].scrollWidth;
    var currentFontSize = parseFloat(title.css("font-size"));
    var percentage = 100;

    //if the screen width is smaller than 1024px, the font won't need to be resized
    //because wrapping is allowed.
    if (window.matchMedia && window.matchMedia("(max-width: 1024px)").matches) {
      /* the viewport width <= 1024px */
      title.css("font-size", "");
    }

    while((currentFontSize > minFontSize) && (scrollWidth > outerWidth)){
        percentage -= 5;
        title.css("font-size", percentage + "%");
        currentFontSize  = parseFloat(title.css("font-size"));
        scrollWidth = titleDiv[0].scrollWidth;
    }

    if(scrollWidth > outerWidth){
        title.css("font-size", minFontSize);
        title.css("white-space", "normal");
    }
  }
  $(window).resize(function(){
    clearTimeout(timer);
    timer = setTimeout(resizeTitle, 250);
  });
  resizeTitle();

});
