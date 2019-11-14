jQuery(document).ready(function($) {
    $('.overlay-content').first().css('display', 'inline-block'); 
    $('.tab-list button').first().addClass('selected-tab');
    $('.overlay-content').first().addClass('selected-content');

    var tabs = $('.tab-list button')
    $(function () {
        $("#first").animate({
           width: '200px'
        }, { duration: 200, queue: false });
    
        $("#second").animate({
           width: '600px'
        }, { duration: 200, queue: false });
    });
        
    //tabs animation
    var handleTabClick = function(e) {
      console.log("handletabclick")
      var indexOfElem = tabs.index(this);
      $('.tab-list button.selected-tab').first().animate({
          marginLeft: '0',
        }, 200 , function() {
          // Animation complete.
          $('.selected-tab').attr('aria-selected', "false");
          $('.selected-tab').attr('tabindex', -1);
          $('.selected-tab').removeClass('selected-tab');
          $('.overlay-content.selected-content').attr('tabindex', -1);
          $('.overlay-content.selected-content').removeClass('selected-content');
          $('.tab-list button').eq(indexOfElem).addClass('selected-tab');
          $('.tab-list button').eq(indexOfElem).attr('aria-selected', "true");
          $('.tab-list button').eq(indexOfElem).attr('tabindex', 0);
          $('.overlay-content').eq(indexOfElem).addClass('selected-content');
          $('.overlay-content').eq(indexOfElem).attr('tabindex', 0);

        });
        $('.tab-list button').eq(indexOfElem).animate({
            marginLeft: '10%',
           }, 200 , function() {
            // Animation complete.
        });  
        
        $('.selected-content').fadeOut('fast', function() {
            $('.overlay-content').eq(indexOfElem).fadeIn('fast'); 
        }); 
    }
    
    tabs.focus(function(e) {
      handleTabClick.call($(e.target))
    });
    
    tabs.on('keydown', function(e) {
      switch(e.keyCode) {
        case KeyCodes.HOME:
          e.preventDefault()
          tabs.first().focus();
          break;
        case KeyCodes.END:
          e.preventDefault()
          tabs.last().focus();
          break;
        case KeyCodes.RIGHT:
        case KeyCodes.DOWN:
          e.preventDefault();
          var focusedIndex = $(':focus').index();
          if (focusedIndex < tabs.length - 1) {
            tabs.eq(focusedIndex + 1).focus();
          }
          else {
            tabs.first().focus();
          }
          break;
        case KeyCodes.LEFT:
        case KeyCodes.UP:
          e.preventDefault();
          var focusedIndex = $(':focus').index();
          if (focusedIndex > 0) {
            tabs.eq(focusedIndex - 1).focus();
          }
          else {
            tabs.last().focus();
          }
          break;
        default:
          var keyCode = e.keyCode;
      }
    })
});
