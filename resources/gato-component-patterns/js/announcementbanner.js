jQuery(document).ready(function($) {

  function rgb2hex(rgb) {
     if (  rgb.search("rgb") == -1 ) {
          return rgb;
     } else {
          rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
          function hex(x) {
               return ("0" + parseInt(x).toString(16)).slice(-2);
          }
          return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
     }
  }

  resizeTimeout(function () {
    $('.mobilefirst-pattern.announcementbanner .color-overlay').each(function() {
      var bg = $(this).css('backgroundColor')
      var opacity = $(this).attr('data-opacity')
      var mobileopacity = $(this).attr('data-mobileopacity')
      if (mobileopacity.length > 0 && window.matchMedia("(max-width: 800px)").matches) {
        opacity = mobileopacity
      }
      var rgb = bg.match(/\d+/g);
      var newColor = "rgba(" + rgb.slice(0,3).join(',') + "," + parseInt(opacity)/100 + ")"
      $(this).css("backgroundColor", newColor)
    })
  })
})
