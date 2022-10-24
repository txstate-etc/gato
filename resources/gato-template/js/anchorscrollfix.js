jQuery(document).ready(function ($) {

function scrollToAnchor(hash, header) {
  var elementExists = !!document.getElementById(hash.slice(1));

  if (elementExists) {
    var target = $(hash);
    var headerHeight = window.stickynavheight + 5;
    if (target.length) {
      // check if it is an faq question or in an faq answer
      if (target.hasClass('faq-question-anchor')) {
        var parent = target.parents('.gato-faqitem-question')
        window.accordion.show(parent, {instant: true})
      } else if (target.parents('.gato-faqitem-answer').length) {
        var $lis = $(target).parents('.gato-faqitem, .gato-faq-group')
        var $lnks = $lis.find('> .gato-faqitem-question, > .gato-faq-group-title')
        window.accordion.show($lnks, {instant: true})
      }
      $('html').velocity('scroll', {
        duration: 400,
        offset: (target.offset().top-headerHeight)+'px',
        complete: function(){
          target.focus();
          if (!target.is(":focus")) {
            target.attr('tabindex', '-1');
            target.focus();
          }
        }
      });
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
