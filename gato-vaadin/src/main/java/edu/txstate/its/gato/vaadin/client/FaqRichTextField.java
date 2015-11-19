package edu.txstate.its.gato.vaadin.client;

import com.vaadin.client.ApplicationConnection;
import com.vaadin.client.UIDL;
import org.vaadin.openesignforms.ckeditor.widgetset.client.ui.CKEditor;
import info.magnolia.ui.vaadin.gwt.client.richtext.VMagnoliaRichTextField;

public class FaqRichTextField extends VMagnoliaRichTextField {

  protected CKEditor editor;
  protected boolean instanceReady = false;

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
  }

  @Override
  public void onChange() {
    log("onChange fired...");
  }

  private native void callUpdateData() /*-{
    $wnd.updateData();
  }-*/;

  private native void callUpdateDisplay() /*-{
    $wnd.updateDisplay();
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
    instanceReady = true;
  }

  private native void faqInstanceReady(String id) /*-{
    $wnd.onFaqCkEditorReady(id);
  }-*/;
}
