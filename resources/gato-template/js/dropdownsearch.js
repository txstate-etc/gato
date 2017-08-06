jQuery(document).ready(function($) {
  $('.search-link.search-button').on('click', function(e){
    e.preventDefault();
    $('#search-modal-content').dialog({
      show: { effect: "slide", direction: "up", duration: 400, easing: 'easeInOutCubic'},
      hide: { effect: "slide", direction: "up", duration: 400, easing: 'easeInOutCubic'},
      position: { my: "center", at: "top" },
      resizable: false,
      draggable: false,
      width: '100%',
      modal: true,
      open: function(){
        $('.ui-widget-overlay').addClass('ui-widget-overlay-fade');
        $('.ui-widget-overlay').bind('click',function(){
            $('#search-modal-content').dialog('close');
        });
        $('#search-text').focus();
      },
      beforeClose: function(){
        var myOverlay = $('.ui-widget-overlay:first').clone();
        myOverlay.attr('id', 'fading-overlay');
        myOverlay.appendTo('body').show();
        myOverlay.removeClass('ui-widget-overlay-fade');
        $('.ui-widget-overlay:first').remove();
        myOverlay.fadeOut(600, function(){
            $(this).remove();
        });
      }
    });
  });
});
