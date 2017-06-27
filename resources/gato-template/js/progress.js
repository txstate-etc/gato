jQuery(document).ready(function($) {

    $('.circle-progress .svg-container svg').each(function(){
        var radius = parseInt($(this).closest('.svg-container').attr('data-radius'));
        var percent = $(this).closest('.svg-container').attr('data-percent')
        var center = { x: parseInt($(this).closest('.svg-container').attr('data-centerx')),
                       y: parseInt($(this).closest('.svg-container').attr('data-centery'))}
        $(this).find('text').text(percent + "%")

        //for now, assume circle is centered on origin
        var start = {x: 0 - radius, y: 0};

        //0 means draw the shorter path around the circle.  1 means draw the longer path
        var largeArcFlag = 0;
        if(percent > 50){
            largeArcFlag = 1;
        }
        //The math trig functions expect an angle in radians
        //To convert from polar coordinates to cartesian coordinates, x = radius * cosine(angle) and y= radius * sine(angle)
        var angle = percentToAngle(percent) + 180;  //starting on negative y axis
        var angleInRadians = angle * Math.PI / 180;
        var end = {
            x: radius * Math.cos(angleInRadians),
            y: radius * Math.sin(angleInRadians)
        }

        //M -> Move to the arc starting point
        //A -> x radius, y radius, x-axis rotation, large-arc-flag, sweep-flag, arc-end-x, arc-end-y
        var path = "M " + (center.x - radius) + " " + center.y + " A " + radius + " " + radius + " 0 " + largeArcFlag + " 0 " + (end.x + center.x) + " " + (center.y - end.y);
        console.log("Path: " + path)
        $(this).find('path').attr("d", path)
    });

    if($(".performance").hasClass( "alternating" )){
      var class_index=1;
      setInterval(function(){
          if(class_index===8){
            class_index=1;
          }
          var $element=$(".performance").attr('class').split(' ')[1];
          var addClass='color'+class_index;
          $( ".performance" ).removeClass($element).addClass(addClass);
          class_index++;

      },5000);
    }
});

// (percent/100) * 360
function percentToAngle(percent){
    return parseInt(percent) * 3.6;
}
