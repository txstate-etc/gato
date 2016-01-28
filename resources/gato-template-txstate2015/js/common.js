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

  // Mobile navigation
  var slideoutPadding = 300;
  //IE9 does not support window.matchMedia
  if (window.matchMedia && window.matchMedia("(max-width: 350px)").matches) {
    /* the viewport width <= 350px */
    slideoutPadding = 275;
  }
  else{
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
});


