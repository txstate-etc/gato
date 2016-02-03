Event.observe( window, "load", function() {
    $$('.itemName a').each( function( item ) {
        //alert( item );
        var answerElement = item.parentNode.next();
        Event.observe( item, "click", function( event ) { 
            Effect.toggle( answerElement, 'blind' );
            Event.stop( event );
        });
    });
    
    $('expandAll').observe( "click", function(event) {
        $$('.detail').each( function( item ) {
            if ( !item.visible() ) Effect.BlindDown( item );
        });
        Event.stop(event);
    });

    $('collapseAll').observe( "click", function(event) {
        $$('.detail').each( function( item ) {
            if ( item.visible() ) Effect.BlindUp( item );
        });
        Event.stop(event);
    });
});