jQuery( document ).ready(function($) {
    var addBackgroundColors = function() {
        $('.section-data').each(function(){
            var title = $(this).attr('data-title');
            var background = $(this).attr('data-background');
            if(!isBlank(title))
              $(this).parent().find('.section-title').text(title).removeClass('hidden')
            if(background == 'show')
              $(this).closest('.gato-section-parent').addClass('has-background');
        });
    };
    resizeTimeout(addBackgroundColors);
});