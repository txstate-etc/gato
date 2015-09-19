Event.observe(window, "load", function() {
  $$('.txst-faqitem-question a').each( function( item ) {
    var para = item.up('.txst-contentarea-paragraph');
    if (!para) para = item.up('.iphone-contentarea-paragraph');
    if (para) para.setStyle({overflow: 'hidden', margin: '10px 0px'});
    var answerElement = item.ancestors()[0].next();
    answerElement.setStyle({display: 'none'});
    Event.observe( item, "click", function( event ) { 
      item.blur();
      var myduration = answerElement.getHeight() / 400;
      if (myduration > 2) myduration = 2;
      if (myduration < .12) myduration = .12;
      Effect.toggle( answerElement, 'blind', { duration: myduration } );
      Event.stop( event );
    });
  });
  
  $$('.txst-faq-group-title a').each(function(item) {
    var groupElement = item.up().next('.txst-faq-group');

    Event.observe(item, 'click', function(event) {
      item.blur();
      var myduration = groupElement.getHeight() / 400;
      if (myduration > 2) myduration = 2;
      if (myduration < .12) myduration = .12;
      Effect.toggle(groupElement, 'blind', { duration: myduration });
      Event.stop(event);
    });
  });

  if ( $('txst-expand-all-faqs') ) {
    Event.observe( 'txst-expand-all-faqs', "click", function(event) {
      $$('.txst-faq-group').each(function(item) {
        if (!item.visible()) Effect.BlindDown(item, {duration: 0.4 });
      });
      $$('.txst-faqitem-answer').each( function( item ) {
        if ( !item.visible() ) Effect.BlindDown( item, { duration: 0.4 } );
      });
      $$('.txst-rss-item-content').each( function( item ) {
        if ( !item.visible() ) {
          item.previous().toggleClassName('collapsed');
          Effect.BlindDown( item, { duration: 1 } );
        }
      });
      $$('.txst-eventdetail').each(function(eventElement){
        if ( !eventElement.gatoVisible ) {
          eventElement.gatoExpandCollapse();
        };
      });
      Event.stop(event);
    });
  }

  if ( $('txst-collapse-all-faqs') ) {
    Event.observe( 'txst-collapse-all-faqs', "click", function(event) {
      $$('.txst-faqitem-answer').each( function( item ) {
        if ( item.visible() ) Effect.BlindUp( item, { duration: 0.4 } );
      });
      $$('.txst-rss-item-content').each( function( item ) {
        if ( item.visible() ) {
          item.previous().toggleClassName('collapsed');
          Effect.BlindUp( item, { duration: 1 } );
        }
      });
      $$('.txst-eventdetail').each(function(eventElement){
        if ( eventElement.gatoVisible ) {
          eventElement.gatoExpandCollapse();
        };
      });
      Event.stop(event);
    });
  }
});
