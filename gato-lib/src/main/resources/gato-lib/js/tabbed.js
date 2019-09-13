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
          $('a.selected-tab').attr('aria-selected', "false")
          $('a.selected-tab').removeClass('selected-tab');
          $('.overlay-content.selected-content').removeClass('selected-content');
          $('.tab').eq(indexOfElem).find('a').first().addClass('selected-tab');
          $('.tab').eq(indexOfElem).find('a').first().attr('aria-selected', "true");
          $('.overlay-content').eq(indexOfElem).addClass('selected-content');

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
    
    tabs.on('click', handleTabClick) 
    tabs.on('keydown', function(e) {
      if (e.keyCode == 13 || e.keyCode == 32) {
        e.preventDefault()
        handleTabClick.call(e.target.closest('div'))
      }
    })
});
