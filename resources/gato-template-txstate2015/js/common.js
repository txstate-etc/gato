// No delay on mobile tapping

window.addEventListener('load', function() {
	FastClick.attach(document.body);
}, false);

jQuery(document).ready(function($) {
  var jqwindow = jQuery(window);
  var headerimage = $(".bg_image, .bg_image_secondary");
  if (headerimage.size() > 0) {
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
      var imgh = himg.height();
      var imgw = himg.width();
      var ar = (1.0*imgw) / imgh;
      resizeTimeout(function () {
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
  jQuery('.top_nav').scrollToFixed({zIndex: 71000});

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
                duration: 500
            });
        return false;
      }
    }
  });

  var resizeTimer,slideout;
  function resizeSlideout(){ 
    var slideoutPadding = 300;
    //IE9 does not support window.matchMedia
    if (window.matchMedia && window.matchMedia("(max-width: 350px)").matches) {
      /* the viewport width <= 350px */
      slideoutPadding = 275;
    }

    if(!slideout){
      slideout = new Slideout({
        'panel': document.getElementById('panel'),
        'menu': document.getElementById('menu'),
        'padding' : slideoutPadding,
        'tolerance': 70,
        'side': 'right',
        'duration': 300,
        'touch': false
      });
    }
    if(!window.matchMedia){
      //since we can't decrease the slideout padding for IE9, don't make the menu smaller either
      jQuery('.slideout-menu').css("width", "300px");
    }
  }
  $(window).resize(function(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeSlideout, 250);
  });
  resizeSlideout();

  jQuery('#menu').css('display', '');

  jQuery('.toggle-button').on("click", function(e){
    e.preventDefault();
    slideout.toggle();
  });

  $(document).on('click', function(event) {
    //If they did not click on the menu button or on the mobile menu itself
    if (!jQuery(event.target).is('.toggle-button') && !jQuery(event.target).closest('#menu').length) {
      //if the menu is open, close it
      if(slideout.isOpen()){
        slideout.close();
      }
    }
  });

  $('.more-tools > a').hovermenu('.super-list-sub');

  //remove hover effect from rich editor image and font awesome links
  $('.column_paragraph a, .footer_content a, .txst-form-body a').each(function(){
    if($(this).find('img, .fa').length > 0){
        $(this).addClass('link-with-children');
    }
  });

  //remove target="_blank" from rich editor, text/image, and FAQ content  but NOT raw html
  $('.column_paragraph :not(.gato-html) a').each(function(){
    if($(this).attr('target') == "_blank")
        $(this).attr('target', "_self");
  });

  var timer;
  function resizeTitle(){
    var title = $('.dept_name .office_name a');
    var titleDiv = $('.office_name');
    var rem=$('html').css("font-size");
    var minFontSize = 3 * parseFloat(rem);
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
        title.css("white-space", "normal");
    }
  }
  $(window).resize(function(){
    clearTimeout(timer);
    timer = setTimeout(resizeTitle, 250);
  });
  resizeTitle();
  

});


