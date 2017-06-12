function initThumbnailSelector(def, node, el) {

  var aspect = 1; controlName = "image";
  if (def.parameters && def.parameters.aspect) {
    aspect = def.parameters.aspect;
  }
  if (def.parameters && def.parameters.controlName) {
    controlName = def.parameters.controlName;
  }

  //There was a problem where the wrong controlName was being used
  //in dialogs with multiple cropper instances. This closure fixes that.
  (function (asp, cn){

    $('.cropImage.cropImage-' + cn).one('load', function(){
      var wrapper = $(this).closest('.cropper-wrapper-' + cn);
      var crop = $(this).cropImage({aspect: asp, controlName: cn});
      wrapper.find('.btnCenterMax').click(function(){
        crop.data('plugin_cropImage').maximize();
      })
      wrapper.find('.btnClear').click(function(){
        crop.data('plugin_cropImage').reset();
      })
    }).each(function() {
      if(this.complete) $(this).trigger('load');
    })
    
  })(aspect, controlName);

}

