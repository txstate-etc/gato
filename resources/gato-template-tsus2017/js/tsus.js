jQuery(document).ready(function($) {
    //toggle menu
    $(".btn-menu").click(function(e){
        e.preventDefault();
        $('.main-menu').slideToggle(300);
        $('.btn-menu').toggleClass('menu-open');
    });
});