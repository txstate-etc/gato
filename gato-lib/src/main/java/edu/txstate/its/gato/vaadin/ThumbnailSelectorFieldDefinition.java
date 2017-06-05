package edu.txstate.its.gato.vaadin;

import info.magnolia.ui.form.field.definition.ConfiguredFieldDefinition;

/******************************************************************************
*
* This field is used with the GatoJsInclude field to make an image cropper.
* The controlName must match the controlName parameter in that field definition.
* The controlName is also the prefix for the cropleft, cropright, croptop, and
* cropbottom fields specified in that definition.
*
* Example fields for dialog:
*
    fields:
        - name: thumbnail
          class: edu.txstate.its.gato.vaadin.ThumbnailSelectorFieldDefinition
          label: Image
          controlName: foo
        - name: script
          class: edu.txstate.its.gato.vaadin.GatoJsIncludeDefinition
          fields:
            - name: foocropleft
              class: edu.txstate.its.gato.vaadin.HiddenFieldDefinition
            - name: foocropright
              class: edu.txstate.its.gato.vaadin.HiddenFieldDefinition
            - name: foocroptop
              class: edu.txstate.its.gato.vaadin.HiddenFieldDefinition
            - name: foocropbottom
              class: edu.txstate.its.gato.vaadin.HiddenFieldDefinition
          transformerClass: info.magnolia.ui.form.field.transformer.composite.DelegatingCompositeFieldTransformer
          initFunction: initThumbnailSelector
          scripts: [gato-lib/js/cropper/js/jQuery.Cropper.js, gato-lib/js/thumbnail-selector.js]
          styles: [gato-lib/js/cropper/css/jquery.cropper.css]
          loadScriptsInOrder: true
          label: ''
          parameters:
            aspect: 1.77777777777
            controlName: foo
*******************************************************************************/

public class ThumbnailSelectorFieldDefinition extends ConfiguredFieldDefinition {
  String controlName = "image";

  public String getControlName() {
    return controlName;
  }

  public void setControlName(String controlName){
    this.controlName = controlName;
  }

}
