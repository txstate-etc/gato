//make all the tiles the same height.  The icons
//are all the same size, but some paragraphs have
//longer descriptions than others

function initNewComponent(def, node, el) {
    //hide script field
    $(el).closest('.v-form-field-section').hide();
    $(el).closest('.dialog-root').addClass('gato-new-component-dialog-root');
    // resizeTiles();
    // var observer = new MutationObserver(function(mutations) {
    //   mutations.forEach(function(mutation) {
    //     resizeTiles();
    //   })
    // })
    //
    // var tabsheetpanel = $('.v-tabsheet-tabsheetpanel');
    // observer.observe(tabsheetpanel[0], {childList: true})
}

function resizeTiles() {
  var tiles = $('.component-text');
  //find the maximum description
  var maxHeight = 0;
  tiles.each(function( index ){
      if($( this ).height() > maxHeight){
          maxHeight = $( this ).height();
      }
  });
  //set the height of all of the tiles to the height of the tallest one
  tiles.each(function() {
   $( this ).height(maxHeight);
 });
}
