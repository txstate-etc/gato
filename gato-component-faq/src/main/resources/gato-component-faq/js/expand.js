jQuery(document).ready(function($) {
  $('.gato-faq-toggle').on('click', function(e) {
    e.preventDefault()
    var faqs = $(this).closest('.gato-faq-expand-collapse').next()
    if ($(this).hasClass('expanded')) {
      $(this).removeClass('expanded')
      $(this).find('.action').text('Expand')
      window.accordion.hide(faqs.find('.shown > .gato-faqitem-question'));
    } else {
      $(this).addClass('expanded')
      $(this).find('.action').text('Collapse')
      window.accordion.show(faqs.find(':not(.shown) > .gato-faq-header'));
    }
  })

  // if the url contains an anchor that lives inside an faq, let's open the FAQ to that item
  if (document.location.hash.match(/^#[a-z][\w\-\:\.]*$/i)) {
    $('.gato-faqitem-answer'+document.location.hash+', .gato-faqitem-answer '+document.location.hash+', .gato-faqitem-answer [name="'+document.location.hash.slice(1)+'"]').each(function (i, ele) {
      var $lis = $(ele).parents('.gato-faqitem, .gato-faq-group');
      var $lnks = $lis.find('> .gato-faqitem-question, > .gato-faq-group-title')
      window.accordion.show($lnks, {instant: true});
    });
  }
});
