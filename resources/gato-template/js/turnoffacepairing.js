function initTurnOffAcePairing(def, node, el) {
  $(el).closest('.v-form-field-section').hide();
  editorEl = $(el).closest('fieldset').find('.ace_editor');
  editorEl.each(function() {
    ace.edit(this.id).setBehavioursEnabled(false);
  });
}
