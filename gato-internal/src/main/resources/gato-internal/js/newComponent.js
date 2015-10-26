//make all the tiles the same height.  The icons
//are all the same size, but some paragraphs have
//longer descriptions than others

function initNewComponent(def, node, el) {
    //hide script field
    $(el).closest('.v-form-field-section').hide();

    var tiles = $('.component-description');
    //find the maximum description
    var maxHeight = 0;
    tiles.each(function( index ){
        if($( this ).height() > maxHeight){
            maxHeight = $( this ).height();
        }
    });
    //set the height of all of the descriptions to the height of the tallest one
    tiles.each(function() {
     $( this ).height(maxHeight);
   });
}