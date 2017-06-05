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
  private String controlName;

  public ThumbnailSelectorField(Node node, GatoUtils gf) {
    this(node, gf, "image");
  }

  public ThumbnailSelectorField(Node node, GatoUtils gf, String controlName){
    this.gf = gf;
    this.node = node;
    this.controlName = controlName;
  }

  @Override
  protected Component initContent() {
    String left = PropertyUtil.getString(node, this.controlName + "cropleft", "0");
    String right = PropertyUtil.getString(node, this.controlName + "cropright", "0");
    String top = PropertyUtil.getString(node, this.controlName + "croptop", "0");
    String bottom = PropertyUtil.getString(node, this.controlName + "cropbottom", "0");

    String itemKey = PropertyUtil.getString(node, "image"); //FIXME: is this name configurable?
    String link = gf.getImg(itemKey, 500, 0, false, false, 0f, 0f, 0f, 0f);
  
    String imgHtml = "";
    if (StringUtils.isEmpty(link)) {
      imgHtml = "You may adjust the cropping for this image after it has been saved.<br/><br/>";
    } else {
      imgHtml = 
        "<div class=\"cropper-wrapper cropper-wrapper-" + this.controlName +"\">" +
            "<input type=\"hidden\" class=\"" + this.controlName + "croptop\" name=\"cropTop\" autocomplete=\"off\" value=\""+top+"\"/>" +
            "<input type=\"hidden\" class=\"" + this.controlName + "cropright\" name=\"cropRight\" autocomplete=\"off\" value=\""+right+"\"/>" +
            "<input type=\"hidden\" class=\"" + this.controlName + "cropbottom\" name=\"cropBottom\" autocomplete=\"off\" value=\""+bottom+"\"/>" +
            "<input type=\"hidden\" class=\"" + this.controlName + "cropleft\" name=\"cropLeft\"  autocomplete=\"off\" value=\""+left+"\"/>" +
            "<div class=\"cropImageContainer\">" +
                "<img class=\"cropImage cropImage-" + this.controlName + "\" src=\""+link+"\" alt=\"\" />" +
            "</div>" +
            "<div class=\"action-buttons\">" +
                "<button class='btnCenterMax'>Center and Maximize</button>" +
                "<button class='btnClear'>Clear</button>" +
            "</div>" +
            "<div class=\"mgnlDialogDescription\">" +
          "Click and drag to select a section of your image to use.<br/><br/>" +
        "</div>" +
        "</div>";
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
