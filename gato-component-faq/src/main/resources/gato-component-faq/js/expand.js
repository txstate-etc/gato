Event.observe(window, "load", function() {
  $$('.txst-faqitem-question a').each( function( item ) {
    var para = item.up('.txst-contentarea-paragraph');
    if (!para) para = item.up('.iphone-contentarea-paragraph');
    if (para) para.setStyle({overflow: 'hidden', margin: '10px 0px'});
    var answerElement = item.ancestors()[0].next();
    answerElement.setStyle({display: 'none'});
    var caretElement = item.down('.caret');
    Event.observe( item, "click", function( event ) { 
      item.blur();
      //answerElement.toggle();
      if(answerElement.visible()){
        Effect.BlindUp( answerElement, { duration: 0.15 } );
        if(caretElement){
          caretElement.removeClassName('fa fa-caret-down');
          caretElement.addClassName('fa fa-caret-right');
        }
      }
      else{
        Effect.BlindDown( answerElement, { duration: 0.15 } );
        if(caretElement){
          caretElement.removeClassName('fa fa-caret-right');
          caretElement.addClassName('fa fa-caret-down');
        }
      }
      Event.stop( event );
    });
  });
  
  $$('.txst-faq-group-title a').each(function(item) {
    var groupElement = item.up().next('.txst-faq-group');

    Event.observe(item, 'click', function(event) {
      item.blur();
      //groupElement.toggle();
      if(groupElement.visible()){
        Effect.BlindUp(groupElement, { duration: 0.15});
      }
      else{
        Effect.BlindDown(groupElement,{ duration: 0.15});
      }
      Event.stop(event);
    });
  });

  if ( $('txst-expand-all-faqs') ) {
    Event.observe( 'txst-expand-all-faqs', "click", function(event) {
      $$('.txst-faq-group').each(function(item) {
        if (!item.visible()) Effect.BlindDown(item, {duration: 0.15 });
      });
      $$('.txst-faqitem-answer').each( function( item ) {
        if ( !item.visible() ) Effect.BlindDown( item, { duration: 0.15 } );
      });
      $$('.caret').each( function( item ) {
        item.removeClassName('fa fa-caret-right');
        item.addClassName('fa fa-caret-down');
      });
      Event.stop(event);
    });
  }

  if ( $('txst-collapse-all-faqs') ) {
    Event.observe( 'txst-collapse-all-faqs', "click", function(event) {
      $$('.txst-faqitem-answer').each( function( item ) {
        if ( item.visible() ) Effect.BlindUp( item, { duration: 0.15 } );
      });
      $$('.caret').each( function( item ) {
        item.removeClassName('fa fa-caret-down');
        item.addClassName('fa fa-caret-right');
      });
      Event.stop(event);
    });
  }
});

