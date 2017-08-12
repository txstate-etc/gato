jQuery(document).ready(function($) {
  $('.gato-faqitem-question, .gato-faq-group-title').click(function(e) {
    e.preventDefault();
    window.accordion.toggle($(this));
  });

  $('#gato-expand-all-faqs').click(function(e) {
    e.preventDefault();
    window.accordion.show($('.gato-faqitem-question, .gato-faq-group-title'));
  });
  $('#gato-collapse-all-faqs').click(function(e) {
    e.preventDefault();
    window.accordion.hide($('.gato-faqitem-question, .gato-faq-group-title'));
  });

  // if the url contains an anchor that lives inside an faq, let's open the FAQ to that item
  if (document.location.hash.match(/^#[a-z][\w\-\:\.]*$/i)) {
    $('.gato-faqitem-answer '+document.location.hash+', .gato-faqitem-answer [name="'+document.location.hash.slice(1)+'"]').each(function (i, ele) {
      var $lis = $(ele).parents('.gato-faqitem, .gato-faq-group');
      var $lnks = $lis.find('> .gato-faqitem-question, > .gato-faq-group-title')
      window.accordion.show($lnks, {instant: true});
    });
  }
});
