jQuery(document).ready(function($) {
    $('.overlay-content').first().css('display', 'inline-block'); 
    $('.tab').find('a').first().css('margin-left', '10%');
    $('.tab').find('a').first().addClass('selected-tab');
    $('.overlay-content').first().addClass('selected-content');

    var tabs = $('.tab')

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
      var indexOfElem = tabs.index(this);        
      $(tabs).find('a.selected-tab').first().animate({
          marginLeft: '0',
        }, 200 , function() {
          // Animation complete.
          $('a.selected-tab').attr('aria-selected', "false");
          $('a.selected-tab').attr('tabindex', -1);
          $('a.selected-tab').removeClass('selected-tab');
          $('.overlay-content.selected-content').attr('tabindex', -1);
          $('.overlay-content.selected-content').removeClass('selected-content');
          $('.tab').eq(indexOfElem).find('a').first().addClass('selected-tab');
          $('.tab').eq(indexOfElem).find('a').first().attr('aria-selected', "true");
          $('.tab').eq(indexOfElem).find('a').first().attr('tabindex', 0);
          $('.overlay-content').eq(indexOfElem).addClass('selected-content');
          $('.overlay-content').eq(indexOfElem).attr('tabindex', 0);

        });
        $(tabs).eq(indexOfElem).find('a').first().animate({
            marginLeft: '10%',
           }, 200 , function() {
            // Animation complete.
        });  
        
        $('.selected-content').fadeOut('fast', function() {
            $('.overlay-content').eq(indexOfElem).fadeIn('fast'); 
        }); 
    }
    
    tabs.find('a').focus(function(e) {
      handleTabClick.call($(e.target).closest('div'))
    });
    
    tabs.on('click', handleTabClick) 
    tabs.on('keydown', function(e) {
      switch(e.keyCode) {
        // case KeyCodes.RETURN:
        // case KeyCodes.SPACE:
        //   e.preventDefault()
        //   handleTabClick.call($(e.target).closest('div'))
        //   break;
        case KeyCodes.HOME:
          e.preventDefault()
          tabs.first().find('a').focus();
          break;
        case KeyCodes.END:
          e.preventDefault()
          tabs.last().find('a').focus();
          break;
        case KeyCodes.RIGHT:
        case KeyCodes.DOWN:
          e.preventDefault();
          var focusedIndex = tabs.find(':focus').parent().index();
          if (focusedIndex < tabs.length - 1) {
            tabs.eq(focusedIndex + 1).find('a').focus();
          }
          else {
            tabs.first().find('a').focus();
          }
          break;
        case KeyCodes.LEFT:
        case KeyCodes.UP:
          e.preventDefault();
          var focusedIndex = tabs.find(':focus').parent().index();
          if (focusedIndex > 0) {
            tabs.eq(focusedIndex - 1).find('a').focus();
          }
          else {
            tabs.last().find('a').focus();
          }
          break;
        default:
          var keyCode = e.keyCode;
      }
    })
});
