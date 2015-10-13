//====================================================================================\\
//        module : Toolkit Events                                                     \\
//       version : 1.1                                                                \\
//          date : 2005-08-12                                                         \\
//        author : Michael van Ouwerkerk - www.speedingrhino.com                      \\
//     copyright : Copyright (c) 2005 Michael van Ouwerkerk                           \\
//     licensing : GNU General Public License (version 2)                             \\
//   description : An event listener system.                                          \\
//====================================================================================\\
//    2005-08-12 : version 1.1 - Michael van Ouwerkerk                                \\
//               : Now officially distributed under the GNU General Public License.   \\
//====================================================================================\\

Toolkit = {};

Toolkit.Events = {
	addListener : function( object, eventName, listener, thisObj ) {
		if( thisObj == null || thisObj == undefined ) thisObj = window;
		if( !object[ eventName + "listeners" ] ) this._prepareForListeners( object, eventName );
		var listeners = object[ eventName + "listeners" ];
		var setListener = true;
		for( var i = 0; setListener && i < listeners.length; i++ ) {
			if( listeners[ i ][ 0 ] == listener && listeners[ i ][ 1 ] == thisObj ) {
				setListener = false;
			}
		}
		if( setListener ) listeners[ listeners.length ] = [ listener, thisObj ];
		return false;
	},
	
	removeListener : function( object, eventName, listener, thisObj ) {
		if( thisObj == null || thisObj == undefined ) thisObj = window;
		var listeners = object[ eventName + "listeners" ];
		if( listeners ) {
			for( var i = 0; i < listeners.length; i++ ) {
				if( listeners[ i ][ 0 ] == listener && listeners[ i ][ 1 ] == thisObj ) {
					for( var j = i; j < listeners.length - 1; j++ ) {
						listeners[ j ] = listeners[ j + 1 ];
					}
					listeners.length--;
					break;
				}
			}
		}
		return false;
	},
	
	clearListeners : function( object, eventName ) {
		object[ eventName + "listeners" ] = [];
		return false;
	},
	
	_prepareForListeners : function( object, eventName ) {
		object[ eventName + "listeners" ] = [];
		if( typeof object[ eventName ] == "function" ) {
			object[ eventName + "listeners" ][ 0 ] = [ object[ eventName ], object ];
		}
		object[ eventName ] = function() {
			var i;
			
			// Copy the arguments array, because sometimes it's read-only.
			// If there are 0 arguments make sure the first argument becomes a reference 
			// to the patched window.event object. If there is 1 argument and it's an event 
			// object (as it should be), patch it as well.
			var argumentsCopy = [];
			for( i = 0; i < arguments.length; i++ ) argumentsCopy[ i ] = arguments[ i ];
			if( arguments.length == 0 && window.event ) {
				argumentsCopy[ 0 ] = Toolkit.Events._patchEvent( window.event, this );
			}
			else if( arguments[ 0 ] && typeof arguments[ 0 ] == "object" 
									&& arguments[ 0 ].toString().search( /event/i ) != -1 ) {
				argumentsCopy[ 0 ] = Toolkit.Events._patchEvent( arguments[ 0 ], this );
			}
			
			// Make a copy of the listeners array and execute that, so it cannot be 
			// modified during execution by addListener or removeListener calls.
			var listeners = this[ eventName + "listeners" ];
			var listenersCopy = [];
			for( i = 0; i < listeners.length; i++ ) listenersCopy[ i ] = listeners[ i ];
			for( i = 0; i < listenersCopy.length; i++ ) {
				listenersCopy[ i ][ 0 ].apply( listenersCopy[ i ][ 1 ], argumentsCopy );
			}
		};
	},
	
	_patchEvent : function( evt, currentTarget ) {
		if( !evt.target ) evt.target = evt.srcElement;
		if( !evt.currentTarget ) evt.currentTarget = currentTarget;
		if( typeof evt.layerX == "undefined" ) evt.layerX = evt.offsetX;
		if( typeof evt.layerY == "undefined" ) evt.layerY = evt.offsetY;
		if( typeof evt.clientX == "undefined" ) evt.clientX = evt.pageX;
		if( typeof evt.clientY == "undefined" ) evt.clientY = evt.pageY;
		if( !evt.stopPropagation ) {
			evt.stopPropagation = function() { this.cancelBubble = true; };
		}
		if( !evt.preventDefault ) {
			evt.preventDefault = function() { this.returnValue = false; };
		}
		return evt;
	}
}

// apply prototype - modified from http://youngpup.net/projects/dhtml/listener/listener.js
if( !Function.prototype.apply ) {
	Function.prototype.apply = function( thisObj, params ) {
		if( thisObj == null || thisObj == undefined ) thisObj = window;
		if( !params ) params = [];
		var args = [];
		for( var i = 0; i < params.length; i++ ) {
			args[ args.length ] = "params[" + i + "]";
		}
		thisObj.__method__ = this;
		var returnValue = eval( "thisObj.__method__(" + args.join( "," ) + ");" );
		thisObj.__method__ = null;
		return returnValue;
	};
}
// end