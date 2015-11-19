package edu.txstate.its.gato.vaadin.client;

import edu.txstate.its.gato.vaadin.server.FaqTextField;
import info.magnolia.ui.vaadin.gwt.client.richtext.RichTextConnector;

import com.vaadin.shared.ui.Connect;

@Connect(FaqTextField.class)
public class FaqRichTextConnector extends RichTextConnector {
  @Override
  public FaqRichTextField getWidget() {
    return (FaqRichTextField) super.getWidget();
  }
}
