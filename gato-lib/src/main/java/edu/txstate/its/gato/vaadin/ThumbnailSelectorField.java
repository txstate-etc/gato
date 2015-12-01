package edu.txstate.its.gato.vaadin;

import info.magnolia.dam.api.Asset;
import info.magnolia.jcr.util.PropertyUtil;

import com.vaadin.ui.Component;
import com.vaadin.ui.CustomField;
import com.vaadin.ui.Label;
import com.vaadin.ui.VerticalLayout;

import edu.txstate.its.gato.GatoUtils;

import javax.jcr.Node;

import org.apache.commons.lang3.StringUtils;

public class ThumbnailSelectorField extends CustomField<Object> {

  private GatoUtils gf;
  private Node node;

  public ThumbnailSelectorField(Node node, GatoUtils gf) {
    this.gf = gf;
    this.node = node;
  }

  @Override
  protected Component initContent() {
    String left = PropertyUtil.getString(node, "imagecropleft", "0");
    String right = PropertyUtil.getString(node, "imagecropright", "0");
    String top = PropertyUtil.getString(node, "imagecroptop", "0");
    String bottom = PropertyUtil.getString(node, "imagecropbottom", "0");

    String itemKey = PropertyUtil.getString(node, "image"); //FIXME: is this name configurable?
    String link = gf.getImg(itemKey, 500, 0, false, false, 0f, 0f, 0f, 0f);
  
    String imgHtml = "";
    if (StringUtils.isEmpty(link)) {
      imgHtml = "You may adjust the cropping for this image after it has been saved.<br/><br/>";
    } else {
      imgHtml = 
        "<div id=\"cropInputs\">" +
          "<input type=\"hidden\" id=\"imagecropleft\" value=\""+left+"\"/>" +
          "<input type=\"hidden\" id=\"imagecropright\" value=\""+right+"\"/>" +
          "<input type=\"hidden\" id=\"imagecroptop\" value=\""+top+"\"/>" +
          "<input type=\"hidden\" id=\"imagecropbottom\" value=\""+bottom+"\"/>" +
        "</div>" +
        "<div id=\"cropImageContainer\">" +
          "<img id=\"cropImage\" src=\""+link+"\" alt=\"\" />" +
        "</div>" +
        "<a href=\"#cropMaximize\" id=\"cropMaximize\">Center and Maximize</a>" +
        "<a href=\"#clearSelection\" id=\"clearSelection\">Clear</a>" +
        "<div class=\"mgnlDialogDescription\">" +
          "Click and drag to select a section of your image to use.<br/><br/>" +
        "</div>"
      ;
    }

    VerticalLayout layout = new VerticalLayout();
    layout.addComponent(new Label(imgHtml, Label.CONTENT_XHTML));
    return layout;  
  }

  @Override
  public Class<? extends Object> getType() {
    return String.class;
  }
}
