jQuery(document).ready(function ($) {

function scrollToAnchor(hash, header) {
  var elementExists = !!document.getElementById(hash.slice(1));

  if (elementExists) {
    var target = $(hash);
    var headerHeight = window.stickynavheight + 5;
  
    if (target.length) {
      $('html').velocity('scroll', { duration: 400, offset: (target.offset().top-headerHeight)+'px' });
    }
  }
}

if (window.location.hash) scrollToAnchor(window.location.hash);

$("a[href*=\\#]:not([href=\\#])").click(function(e) {
  if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
    && location.hostname == this.hostname) {
    e.preventDefault();
    scrollToAnchor(this.hash);
  }
});

});
