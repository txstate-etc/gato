jQuery(document).ready(function($) {

    //toggle menu
    $(".btn-menu").click(function(e){
        e.preventDefault();
        var $btn = $(this);
        $('.main-menu').slideToggle(300);
        $btn.toggleClass('menu-open');
        $btn.attr('aria-expanded', $btn.hasClass('menu-open'));
    });

    $(document).click(function(e){
      var target = $(e.target);
      if( $('.btn-menu').hasClass('menu-open') && !target.is('.btn-menu') && !target.closest('.main-menu').length){
        e.preventDefault();
        $('.btn-menu').removeClass('menu-open');
        $('.main-menu').slideUp();
      }
    });

    // close the menu with the escape key
    $(document).keyup(function (e) {
      if (e.keyCode === 27 && $('.btn-menu').hasClass('menu-open')) {
        e.preventDefault();
        $('.btn-menu').removeClass('menu-open');
        $('.main-menu').slideUp();
        $('.btn-menu').focus();
      }
    });

    function evaluate_tsus_logos() {
      var container = $('.gato-flex-container');
      var logos = container.find('li');
      var logocount = logos.size();
      var minwidth = 100;
      var maxwidth = 300;
      var absolutemaxcols = Math.min(logocount, 12);
      var containerwidth = container.width();
      var maxcols = Math.min(Math.floor(containerwidth / minwidth), absolutemaxcols);
      var mincols = Math.max(Math.ceil(containerwidth / maxwidth), 1);
      var currentbest = maxcols;
      for (var i = mincols; i <= maxcols; i++) {
        var proposedremainder = (i - (logocount % i)) % i;
        if (proposedremainder < 2) currentbest = i;
      }
      container.removeClass(function (idx, classname) {
        return (classname.match (/flex-columns-\S+/g) || []).join(' ');
      }).addClass('flex-columns-'+currentbest);
    }

    resizeTimeout(evaluate_tsus_logos);

    /*Hide nav if no content inside each items*/
    (function(){
      var $sidebar=$('.sidebar');
      if(!$sidebar.hasClass('show-inedit')){
        var $childOfSidebar=$sidebar.children('.side_nav');
        var showSideBarInLive=false;
        $childOfSidebar.each(function(){
            if($(this).children().length>0){
                showSideBarInLive=true;
                return false;
            }
        });
        if(showSideBarInLive==false){
          $sidebar.hide();
        }
      }
    })();
    /*Hide nav logic ends*/

});

jQuery(window).on('load', function($) {

    var $ = jQuery;
    var $grid = $(".masonry-section").masonry({
    itemSelector: ".gato-card",
    columnWidth: ".masonry-sizer",
    gutter: 0,
    percentPosition: true,
  });

  $grid.imagesLoaded(function() {
    //waits till images are being loaded before triggering new layout.
    $grid.masonry('layout');
});

});
