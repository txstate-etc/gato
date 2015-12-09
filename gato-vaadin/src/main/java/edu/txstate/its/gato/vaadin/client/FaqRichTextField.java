package edu.txstate.its.gato.vaadin.client;

import com.vaadin.client.ApplicationConnection;
import com.vaadin.client.UIDL;
import org.vaadin.openesignforms.ckeditor.widgetset.client.ui.CKEditor;
import info.magnolia.ui.vaadin.gwt.client.richtext.VMagnoliaRichTextEditor;
import info.magnolia.ui.vaadin.gwt.client.richtext.VMagnoliaRichTextField;

import java.util.Arrays;

public class FaqRichTextField extends VMagnoliaRichTextField {

  protected CKEditor editor;
  protected boolean instanceReady = false;
  protected boolean uidlLoaded = false;

  @Override
  protected CKEditor loadEditor(String inPageConfig) {
    editor = super.loadEditor(inPageConfig);
    return editor;
  }

  @Override
  public void updateFromUIDL(UIDL uidl, ApplicationConnection client) {
    // Pass any plugin events from server to plugin.
    if (uidl.hasAttribute(VAR_FIRE_PLUGIN_EVENT) && this.editor != null) {
      ((VMagnoliaRichTextEditor)editor).fire(
        uidl.getStringAttribute(VAR_FIRE_PLUGIN_EVENT),
        uidl.getStringAttribute(VAR_FIRE_PLUGIN_EVENT_VALUE)
      );
    }

    // Only do super.updateFromUIDL on initial load otherwise weird things start happening
    // like data being wiped out and the editor changing out from under us.
    if (uidlLoaded) return;
    uidlLoaded = true;
    super.updateFromUIDL(uidl, client);
  }

  @Override
  public void onChange() {
  }

  private native void callUpdateData() /*-{
    $wnd.FaqTree.updateData();
  }-*/;

  private native void callUpdateDisplay() /*-{
    $wnd.FaqTree.updateDisplay();
  }-*/;

  @Override
  public void onBlur() {
    if (instanceReady) { callUpdateData(); }
  }

  @Override
  public void onFocus() {
  }

  @Override
  public void onModeChange(String mode) {
  }

  @Override public void doResize() {
    if (instanceReady) { callUpdateData(); }
    super.doResize();
    if (instanceReady) { callUpdateDisplay(); }
  }

  @Override
  public void onInstanceReady() {
    super.onInstanceReady();
    faqInstanceReady(editor.getId());
  }

  @Override
  public void onDataReady() {
    super.onDataReady();
    instanceReady = true;
  }

  private native void faqInstanceReady(String id) /*-{
    $wnd.FaqTree.onFaqCkEditorReady(id);
  }-*/;
}
