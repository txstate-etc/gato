jQuery(document).ready(function($) {
  magnolialabelchange('.menubar .menu', '.mgnlEditor.mgnlPlaceholder', 'Add Header Links');
  magnolialabelchange('.multilinks .editMultiLinks', '.mgnlEditor.mgnlEditorBar', 'Header Links');
  magnolialabelchange('.mobilefirst_component_add', '.mgnlEditor.mgnlPlaceholder', "Add Section");
  magnolialabelchange('.addBannerImage', '.mgnlEditor.mgnlPlaceholder', 'Edit Banner Image');
  
  magnolialabelchange('.tabbed_add', '.mgnlEditor.mgnlPlaceholder', 'Add Tab');
  magnolialabelchange('.tabbed_max', '.mgnlEditor.mgnlPlaceholder', 'Maximum tabs added');

  magnolialabelchange('.explore_add', '.mgnlEditor.mgnlPlaceholder', 'Add Card');
  magnolialabelchange('.explore_max', '.mgnlEditor.mgnlPlaceholder', 'Maximum cards added');
  
  $('.top-bar .btn-audience').click(function() {
    var $dropdown = $('.dropdown')
    var button = $(this);
    if ($dropdown.hasClass('open')) {
      $dropdown.removeClass('open');
      button.attr('aria-expanded', 'false');
    }
    else {
      $dropdown.addClass('open');
      button.attr('aria-expanded', 'true');
    }
  })
});
  