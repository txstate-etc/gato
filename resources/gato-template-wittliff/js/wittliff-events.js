jQuery(document).ready(function($) {
    $('.event-details').click(function(e){
        e.preventDefault();
        window.accordion.toggle($(this));
    });
});