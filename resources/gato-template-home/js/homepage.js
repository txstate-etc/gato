jQuery(document).ready(function($) {
  window.stickynavheight = $('#panel .header-bars').height();

  magnolialabelchange('.menubar .menu', '.mgnlEditor.mgnlPlaceholder', 'Add Header Links');
  magnolialabelchange('.multilinks .editMultiLinks', '.mgnlEditor.mgnlEditorBar', 'Header Links');
  magnolialabelchange('.mobilefirst_component_add', '.mgnlEditor.mgnlPlaceholder', "Add Section");
  magnolialabelchange('.addBannerImage', '.mgnlEditor.mgnlPlaceholder', 'Edit Banner Image');

  magnolialabelchange('.tabbed_add', '.mgnlEditor.mgnlPlaceholder', 'Add Tab');
  magnolialabelchange('.tabbed_max', '.mgnlEditor.mgnlPlaceholder', 'Maximum tabs added');

  magnolialabelchange('.explore_add', '.mgnlEditor.mgnlPlaceholder', 'Add Card');
  magnolialabelchange('.explore_max', '.mgnlEditor.mgnlPlaceholder', 'Maximum cards added');

  var $audienceButton = $('.top-bar .btn-audience');

  var closeAudiencePanel = function() {
    $('.dropdown').removeClass("open")
    $audienceButton.attr('aria-expanded', 'false')
  }
  $audienceButton.click(function() {
    var $dropdown = $('.dropdown')
    var button = $(this);
    if ($dropdown.hasClass('open')) {
      closeAudiencePanel();
    }
    else {
      $dropdown.addClass('open');
      button.attr('aria-expanded', 'true');
    }
  })

  $('.top-bar .btn-audience').on('keydown', function(e){
    //close menu on ESC
    if (e.keyCode == KeyCodes.ESCAPE && $('.dropdown').hasClass('open')) {
      closeAudiencePanel();
    }
    if (e.keyCode == KeyCodes.DOWN || e.keyCode == KeyCodes.RIGHT) {
      $('#audience-panel li a').first().focus();
    }
  })
  $('#audience-panel').on('keydown', function(e) {
    if (e.keyCode == KeyCodes.ESCAPE && $('.dropdown').hasClass('open')) {
      closeAudiencePanel();
      $audienceButton.focus();
    }
  })
  $('#audience-panel li a').on('keydown', function(e) {
    var $items = $('#audience-panel li a');
    var $target = $(e.target);
    if (e.keyCode == KeyCodes.DOWN || e.keyCode == KeyCodes.RIGHT) {
      e.preventDefault();
      var index = $items.index($target) + 1;
      index = (index > ($items.length - 1)? 0 : index);
      $items.get(index).focus();
    }
    else if (e.keyCode == KeyCodes.UP || e.keyCode == KeyCodes.LEFT) {
      e.preventDefault();
      var index = $items.index($target) - 1;
      index = (index < 0 ? ($items.length - 1) : index);
      $items.get(index).focus();
    }
  })

});
