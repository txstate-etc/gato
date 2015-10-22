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

  $$('.txst-rss-item.collapsible h3 a').each( function( item ) {
    var parent = item.ancestors()[0];
    var descElement = parent.next();
    Event.observe( item, "click", function( event ) { 
      item.blur();
      var myduration = descElement.getHeight() / 400;
      if (myduration > 1) myduration = 1;
      if (myduration < .5) myduration = .5;
      parent.toggleClassName('collapsed');
      Effect.toggle( descElement, 'blind', { duration: myduration } );
      Event.stop( event );
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


Event.observe(document,"dom:loaded",function() {
  $$('.txst-eventdetail').each(function(eventElement){
    var toggle = (eventElement.select('.txst-eventdetail-togglebutton'))[0];
    eventElement.gatoEffects = new Array();

    if ( eventElement.hasClassName("txst-eventdetail-collapsedliststyle") ) {
      eventElement.gatoVisible = false;
      eventElement.setStyle({
        borderBottomColor: '#FFFFFF',
        paddingBottom: '0px',
        overflow: 'hidden'
      });
      eventElement.select('.txst-eventdetail-description',
        '.txst-eventdetail-detailsbox',
        '.txst-eventdetail-thumbnail',
        '.txst-eventdetail-extra2').invoke('setStyle',{display:'none'});
      toggle.setStyle({backgroundImage: 'url(/magnoliaAssets/paragraphs/images/toggle_open.gif)'});
    } else {
      eventElement.setStyle({
        borderBottomColor: '#B29F71',
        paddingBottom: '0px',
        overflow: 'hidden'
      });
      eventElement.setStyle({
        height: (eventElement.getHeight()+9) + 'px'
      });
      eventElement.gatoVisible = true;
      toggle.setStyle({backgroundImage: 'url(/magnoliaAssets/paragraphs/images/toggle_close.gif)'});
    }
    
    toggle.setStyle({
      position: 'absolute',
      zIndex: 1,
      top: '0px',
      left: '0px',
      width: '14px',
      height: '14px',
      cursor: 'pointer',
      backgroundRepeat: 'no-repeat'
    });
    eventElement.select('.txst-eventdetail-title','.txst-eventdetail-dates').invoke('setStyle',{marginLeft: '17px'});
    
    eventElement.gatoExpandCollapse = function( event ) {
      eventElement.gatoVisible = !eventElement.gatoVisible;
      eventElement.gatoEffects.each(function(effect){effect.cancel()});
      eventElement.gatoEffects.clear();
      
      eventElement.setStyle({height: 'auto'});
      eventElement.select('.txst-eventdetail-description',
        '.txst-eventdetail-detailsbox',
        '.txst-eventdetail-thumbnail',
        '.txst-eventdetail-extra2').invoke('setStyle',{display:'none'});
      var closedHeight = eventElement.getHeight();
      eventElement.select('.txst-eventdetail-description',
        '.txst-eventdetail-detailsbox',
        '.txst-eventdetail-thumbnail',
        '.txst-eventdetail-extra2').invoke('setStyle',{display:'block'});
      var openHeight = eventElement.getHeight()+9;
      
      if ( eventElement.gatoVisible ) {
        eventElement.setStyle({height: closedHeight+'px',borderBottomColor: '#FFFFFF'});
        eventElement.gatoEffects.push(new Effect.Morph(eventElement,{style:'height:'+openHeight+'px;border-bottom-color: #B29F71;'}));
        eventElement.select('.txst-eventdetail-description',
        '.txst-eventdetail-detailsbox',
        '.txst-eventdetail-thumbnail',
        '.txst-eventdetail-extra2').invoke('setStyle',{display:'none'});
        eventElement.select('.txst-eventdetail-description',
          '.txst-eventdetail-detailsbox',
          '.txst-eventdetail-thumbnail',
          '.txst-eventdetail-extra2').each(function(element){ eventElement.gatoEffects.push(Effect.Appear(element)) });
        toggle.setStyle({backgroundImage: 'url(/magnoliaAssets/paragraphs/images/toggle_close.gif)'});
      } else {
        eventElement.setStyle({height: openHeight+'px',borderBottomColor: '#B29F71'});
        eventElement.gatoEffects.push(new Effect.Morph(eventElement,{style:'height:'+closedHeight+'px;border-bottom-color: #FFFFFF;'}));
        eventElement.select('.txst-eventdetail-description',
        '.txst-eventdetail-detailsbox',
        '.txst-eventdetail-thumbnail',
        '.txst-eventdetail-extra2').invoke('setStyle',{display:'block'});
        eventElement.select('.txst-eventdetail-description',
          '.txst-eventdetail-detailsbox',
          '.txst-eventdetail-thumbnail',
          '.txst-eventdetail-extra2').each(function(element){ eventElement.gatoEffects.push(Effect.Fade(element)) });
        toggle.setStyle({backgroundImage: 'url(/magnoliaAssets/paragraphs/images/toggle_open.gif)'});
      }
      if ( event ) {
        event.stop();
      }
    };
    
    var titleElement = (eventElement.select('.txst-eventdetail-title'))[0];
    var titleContents = titleElement.innerHTML;
    titleElement.innerHTML = '';
    var titleLinkElement = new Element("a",{href:"#",style:"color:#501214"});
    titleLinkElement.innerHTML = titleContents;
    titleElement.insert(titleLinkElement);
    titleElement.observe("click",eventElement.gatoExpandCollapse);
    toggle.observe("click",eventElement.gatoExpandCollapse);
  });
});

Event.observe(document,"dom:loaded",function() {
    $$('.txst-rss-item-content').each(function(item){
        if (item.previous().hasClassName('collapsed')) {
            item.setStyle({
                display: 'none',
                overflow: 'hidden'
            });
        }
    });
});
