function initThumbnailSelector(def, node, el) {
  if (def.aspect) {
    Cropper.aspect = def.aspect;
  }
  if (def.name) {
    Cropper.controlName = def.name;
  }
  
  Toolkit.Events.addListener(document.getElementById('cropMaximize'), "onclick", function(e){
    e.preventDefault();
    e.stopPropagation();
    Cropper.maximize();
    return false;
  }, Cropper);

  Toolkit.Events.addListener(document.getElementById('clearSelection'), "onclick", function(e){
    e.preventDefault();
    e.stopPropagation();
    Cropper.reset();
    return false;
  }, Cropper);

  $('#cropImage').one('load', function() {
    Cropper.init();
  }).each(function() {
    if(this.complete) $(this).trigger('load');
  });
  
  //FIXME: how do we save the data?
}
