package edu.txstate.its.gato.vaadin.client;

import com.vaadin.client.ApplicationConnection;
import com.vaadin.client.UIDL;
import org.vaadin.openesignforms.ckeditor.widgetset.client.ui.CKEditor;
import info.magnolia.ui.vaadin.gwt.client.richtext.VMagnoliaRichTextField;

public class FaqRichTextField extends VMagnoliaRichTextField {

  protected CKEditor editor;

  @Override
  protected CKEditor loadEditor(String inPageConfig) {
    editor = super.loadEditor(inPageConfig);
    return editor;
  }

  @Override
  public void updateFromUIDL(UIDL uidl, ApplicationConnection client) {
    String dataBefore = "";

    if (editor != null) { dataBefore = editor.getData(); }

    super.updateFromUIDL(uidl, client);

    if (editor != null && !dataBefore.equals(editor.getData())) {
      editor.setData(dataBefore);
    }

    log("updateFromUIDL called...");
  }

  @Override
  public void onChange() {
    log("onChange fired...");
    callUpdateData();
  }

  private native void callUpdateData() /*-{
    $wnd.updateData();
  }-*/;

  private native void log(String msg) /*-{
    $wnd.console.log(msg);
  }-*/;

  @Override
  public void onBlur() {
    log("onBlur fired...");
  }

  @Override
  public void onFocus() {
    log("onFocus fired...");
  }

  @Override
  public void onModeChange(String mode) {
    log("onModeChange fired...");
  }

  @Override
  public void onInstanceReady() {
    super.onInstanceReady();
    faqInstanceReady(editor.getId());
  }

  private native void faqInstanceReady(String id) /*-{
    $wnd.console.log("Calling ckeditor ready...");
    $wnd.onFaqCkEditorReady(id);
  }-*/;
}
