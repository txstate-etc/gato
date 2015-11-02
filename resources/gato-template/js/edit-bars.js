jQuery( document ).ready(function() {
    //need to wait for the bars to load.  they are slooooooooow
    //should use MutationObserver if javascript is necessary to modify the bars
    setTimeout(function() {
        jQuery('.mgnlPlaceholder .mgnlEditorBar .mgnlEditorBarLabel').html("+ Add Content");
    }, 1000);
});