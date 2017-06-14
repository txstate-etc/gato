jQuery(document).ready(function($) {
    //toggle menu
    $(".btn-menu").click(function(e){
        e.preventDefault();
        $('.main-menu').slideToggle(300);
        $('.btn-menu').toggleClass('menu-open');
    });
    $(window).resize(function(){
      var $logoVar=$('.tsus-institution-logos li');
      var $tCount=$logoVar.length;
    	if ($(window).width() <= 767){
        if($tCount==8){
          $logoVar.css("width","20%");
        }
    	}
      else{
        if($tCount==8){
          $logoVar.css("width","auto");
        }
      }
    });


});
