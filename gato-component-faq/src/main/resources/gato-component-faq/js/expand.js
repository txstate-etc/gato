jQuery(document).ready(function($) {
  var show = function ($lnk, options) {
    options = options || {};
    var $li = $lnk.closest('li');
    var $panel = $lnk.next();
    $li.addClass('shown');
    $li.attr('aria-expanded', true);
    if (options.instant) {
      $panel.show();
    } else {
      $panel.velocity('slideDown', { duration: 150 });
    }
  }

  var hide = function($lnk, options) {
    options = options || {};
    var $li = $lnk.closest('li');
    var $panel = $lnk.next();
    $li.removeClass('shown');
    $li.attr('aria-expanded', false);
    if (options.instant) {
      $panel.hide();
    } else {
      $panel.velocity('slideUp', { duration: 150 });
    }
  }

  var toggle = function($lnk) {
    var $li = $lnk.closest('li');
    if ($li.hasClass('shown')) hide($lnk);
    else show($lnk);
  }

  $('.gato-faqitem-question, .gato-faq-group-title').click(function(e) {
    e.preventDefault();
    toggle($(this));
  });

  $('#gato-expand-all-faqs').click(function(e) {
    e.preventDefault();
    show($('.gato-faqitem-question, .gato-faq-group-title'));
  });
  $('#gato-collapse-all-faqs').click(function(e) {
    e.preventDefault();
    hide($('.gato-faqitem-question, .gato-faq-group-title'));
  });

  // if the url contains an anchor that lives inside an faq, let's open the FAQ to that item
  $('.gato-faqitem-answer '+location.hash).each(function (i, ele) {
    var $lis = $(ele).parents('.gato-faqitem, .gato-faq-group');
    var $lnks = $lis.find('> .gato-faqitem-question, > .gato-faq-group-title')
    show($lnks, {instant: true});
  });
});
