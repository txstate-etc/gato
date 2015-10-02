keyCodes = new Array();
Event.observe( window, "load", function() {
        Event.observe( window, "keyup", function( event ) {
                keyCodes.push( event.keyCode );
                if ( keyCodes.length > 10 ) {
                        keyCodes.shift();
                }
                if ( keyCodes[0] == Event.KEY_UP &&
                        keyCodes[1] == Event.KEY_UP &&
                        keyCodes[2] == Event.KEY_DOWN &&
                        keyCodes[3] == Event.KEY_DOWN &&
                        keyCodes[4] == Event.KEY_LEFT &&
                        keyCodes[5] == Event.KEY_RIGHT &&
                        keyCodes[6] == Event.KEY_LEFT &&
                        keyCodes[7] == Event.KEY_RIGHT &&
                        keyCodes[8] == 66 &&
                        keyCodes[9] == 65
                    ) {
						var s = document.createElement('script');
						s.type='text/javascript';
						document.body.appendChild(s);
						s.src=magnolia_assets_url+'/gato-template/js/asteroids.js'                
					}
        });
});

