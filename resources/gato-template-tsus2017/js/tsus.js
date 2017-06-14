jQuery(document).ready(function($) {

    //toggle menu
    $(".btn-menu").click(function(e){
        e.preventDefault();
        $('.main-menu').slideToggle(300);
        $('.btn-menu').toggleClass('menu-open');
    });


    function setWidth($logoVar,$column){
      var $logoWidth;//in order to force column count
      $logoWidth=100.0/$column;//100% divided by column count.
      $logoVar.css("width",$logoWidth+"%");
      console.log('columns:'+$column);// for testing
      console.log('width of columns:'+$logoWidth);// for testing
    }
    function setColumn($divider,$tCount){
      var $column;
      var $optimize = $tCount/$divider;// what we will flip by if needed
      if(($optimize)>4)//max of 4 columns if more than 4 divide again
      {
        $column=($tCount/$divider)/$divider;
        if($column<2)
        {
          console.log("optimizing grid structure.....");
          $column=($tCount/$optimize);

        }
      }
      else{
          $column=$tCount/$divider;
      }
      console.log("2nd func is working")
      return $column;
    }
    function setGrid($logoVar,$tCount){
      var $gridSet=false;
      var $column;
      if($tCount%2==0){
          $column = setColumn(2,$tCount);
          setWidth($logoVar,$column);
          $gridSet=true;
          return $gridSet;
      }
      else if ($tCount%3==0) {
        $column = setColumn(3,$tCount);
        setWidth($logoVar,$column);
        $gridSet=true;
        return $gridSet;
      }
    }



    resizeTimeout(function(){
        var $logoVar=$('.tsus-institution-logos li');
        var $tCount=$logoVar.length;
        var $gridSet = false;
      	if ($(window).width() <= 768){
            $gridSet=setGrid($logoVar,$tCount);
          if(!$gridSet)// meaning its prime
            {
              console.log('prime detected!....resolving');
              $tCount=$tCount + 1;// add 1 then call again.
              $gridSet=setGrid($logoVar,$tCount);

            }
      	}
        else{
            $logoVar.css("width","auto");
        }
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
