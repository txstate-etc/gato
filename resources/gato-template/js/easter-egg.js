jQuery(document).ready(function ($) {
  var keyHistory = new Array();
  $(window).keyup(function(e) {
    keyHistory.push( e.which );
    if ( keyHistory.length > 10 ) {
      keyHistory.shift();
    }
    if (
      keyHistory[0] == KeyCodes.UP &&
      keyHistory[1] == KeyCodes.UP &&
      keyHistory[2] == KeyCodes.DOWN &&
      keyHistory[3] == KeyCodes.DOWN &&
      keyHistory[4] == KeyCodes.LEFT &&
      keyHistory[5] == KeyCodes.RIGHT &&
      keyHistory[6] == KeyCodes.LEFT &&
      keyHistory[7] == KeyCodes.RIGHT &&
      keyHistory[8] == KeyCodes.B &&
      keyHistory[9] == KeyCodes.A
    ) {
      var s = document.createElement('script');
      s.type='text/javascript';
      s.src=magnolia_assets_url+'/gato-template/js/asteroids.js'
      $('body').append(s);
    }
  });
});

