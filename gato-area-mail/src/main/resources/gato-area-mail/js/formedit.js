/* The senderInfo radio buttons are not there anymore.  I'm not deleting this file
*  because I think we will need it for something else.  In the meantime, this code
*  is commented out because the missing senderInfo field was causing an error
*/




// The vaadin combobox isn't implemented using a standard select.
// Instead, it creates a table element containing the choices when
// the dropdown is clicked. The email address data type needs to
// be selected from the dropdown if the radio button setting this
// field as the form sender's email address is selected. The ftl
// file will set the input to an email if senderInfo is selected,
// so even if the user changes
function initFormEdit(def, node, el) {
  $(el).closest('.v-form-field-section').hide();


  // // Hate to use setTimeout here, but still haven't figured out a reliable
  // // way to know if the other vaadin fields are loaded before the js include.
  // setTimeout(function() {
  //   var senderInfoRadio = $('.senderInfo').find('input')[2];
  //   var dataTypeInput = $('.dataType').find('input');
  //   var overlayContainer = $('.v-overlay-container')[0];
  //   var restoreRadioFocus = false;

  //   function setDataTypeToEmail() {
  //     $('.dataType').find('.v-filterselect-button')[0].click()
  //     observer.observe(overlayContainer, {childList: true});
  //   }

  //   var observer = new MutationObserver(function(mutations) {
  //     if ($('.v-filterselect-suggestmenu').find('tr').length) {
  //       $('.v-filterselect-suggestmenu').find('tr').find('span')[5].click();
  //       if (restoreRadioFocus) senderInfoRadio.focus();
  //       observer.disconnect();
  //     }    
  //   });

  //   $(senderInfoRadio).change(function() {
  //     if (this.checked && dataTypeInput.value != "E-Mail Address") {
  //       restoreRadioFocus = true;
  //       setDataTypeToEmail();
  //     }
  //   });

  //   if (senderInfoRadio.checked && dataTypeInput.value != "E-Mail Address") {
  //     setDataTypeToEmail();  
  //   }
  // }, 500);
}
