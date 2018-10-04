package edu.txstate.its.gato.componentselect;

import com.vaadin.v7.ui.CustomField;
import com.vaadin.v7.ui.VerticalLayout;
import com.vaadin.v7.ui.HorizontalLayout;
import com.vaadin.ui.GridLayout;
import com.vaadin.v7.ui.TextField;
import com.vaadin.v7.ui.Label;
import com.vaadin.ui.TabSheet;
import com.vaadin.ui.Component;
import com.vaadin.v7.data.Property;
import com.vaadin.annotations.StyleSheet;
import com.vaadin.server.ExternalResource;
import com.vaadin.ui.Image;

import java.util.ArrayList;
import java.util.List;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Set;
import org.apache.commons.lang3.StringUtils;

import com.vaadin.event.LayoutEvents.LayoutClickEvent;
import com.vaadin.event.LayoutEvents.LayoutClickListener;

import com.vaadin.ui.TabSheet.SelectedTabChangeEvent;

@StyleSheet("vaadin://css/componentselect.css")
public class GatoComponentSelector extends CustomField<String>{

    private static final String ICON_HEIGHT = "108px";

    private LinkedHashMap<String,ArrayList<GatoComponentSelectOption>> templates;

    private VerticalLayout rootLayout = new VerticalLayout();
    private TextField hidden = new TextField();

    private ArrayList<VerticalLayout> allTiles = new ArrayList<VerticalLayout>();


    public GatoComponentSelector(LinkedHashMap<String,ArrayList<GatoComponentSelectOption>> templates){
        this.templates = templates;
    }

    //The component is built using several horizonal layouts instead of a GridLayout
    //component because the GridLayout sometimes overlaps the components.
    @Override
    protected Component initContent() {

      Set<String> keys = templates.keySet();
      if (keys.size() > 1) {
        TabSheet tabsheet = new TabSheet();
        for (String k : keys) {
          ArrayList contentTypes = templates.get(k);
          VerticalLayout tab = buildTabContent(contentTypes);
          tabsheet.addTab(tab, k);
        }

        rootLayout.addComponent(tabsheet);
      }
      else {
        ArrayList contentTypes = new ArrayList<GatoComponentSelectOption>();
        for (String k : keys) {
          contentTypes = templates.get(k);
        }
        VerticalLayout tab = buildTabContent(contentTypes);
        rootLayout.addComponent(tab);
      }

      hidden.setVisible(false);
      rootLayout.addComponent(hidden);
      return rootLayout;
    }

    private VerticalLayout buildTabContent(ArrayList contentTypes) {
      int numTemplates = contentTypes.size();
      int columns = 3;
      int rows =(int) Math.ceil(numTemplates/3.0);
      int templateIndex = 0;
      VerticalLayout tab = new VerticalLayout();
      for ( int i=0; i< rows; i++) {
        HorizontalLayout hl = new HorizontalLayout();
        hl.setSpacing(true);
        hl.setSizeFull();
        hl.addStyleName("component-row");
        for (int j=0; j<columns && templateIndex < numTemplates; j++) {
          GatoComponentSelectOption option = (GatoComponentSelectOption) contentTypes.get(templateIndex);
          VerticalLayout tile = buildGridComponent(option);
          //if there is only one component, select it
          // if (keys.size() == 1 && numTemplates == 1) {
          //   hidden.setValue(option.getComponentId());
          //   tile.addStyleName("selected-component");
          // }
          hl.addComponent(tile);
          templateIndex++;
        }
        //add empty labels to make sure last row elements are not extra wide
        if(i == rows-1 && numTemplates % columns > 0){
            int emptySpaces = columns - (numTemplates % columns);
            for(int m=0; m<emptySpaces; m++){
                hl.addComponent(new Label("&nbsp;", Label.CONTENT_XHTML));
            }
        }
        tab.addComponent(hl);
      }
      return tab;
    }

    //build an individual "cell."  Each cell has a title
    //and icon.  If there is no icon, then just the title is displayed.
    private VerticalLayout buildGridComponent(GatoComponentSelectOption template){
        //set up the outer layout
        VerticalLayout tile = new VerticalLayout();
        tile.setSizeFull();
        tile.addStyleName("gato-grid-component");
        tile.setMargin(true);

        if(!StringUtils.isBlank(template.getIconPath())){
            ExternalResource resource = new ExternalResource(template.getIconPath());
            //null means the image has no caption
            Image icon = new Image(null,resource);
            icon.addStyleName("component-icon");
            tile.addComponent(icon);
        }
        else{
            //insert an empty image.  A default component icon would look better.
            Image blank = new Image();
            blank.setHeight(ICON_HEIGHT);
            blank.addStyleName("component-icon");
            tile.addComponent(blank);
        }

        String titleHtml = "<div class=\"component-title\">" + template.getTitle() + "</div>";
        String descriptionHtml = "<div class=\"component-description\">" + template.getDescription() + "</div>";
        String textHtml = "<div class=\"component-text\">" + titleHtml + "</div>";
        Label textContent = new Label(textHtml, Label.CONTENT_XHTML);
        //titleLabel.addStyleName("component-title");
        textContent.setSizeFull();
        tile.addComponent(textContent);

        tile.addLayoutClickListener(new LayoutClickListener() {
            public void layoutClick(final LayoutClickEvent event) {
                //set hidden field value to the ID of the clicked component/paragraph
                hidden.setValue(template.getComponentId());
                //make it look selected and unselect all others
                removeSelectedStyleFromComponents();
                //label.addStyleName("selected-component");
                tile.addStyleName("selected-component");
            }
        });
        allTiles.add(tile);
        return tile;
    }

    //remove the "selected-component" style name from all components
    //so only one appears selected at a time
    private void removeSelectedStyleFromComponents(){
      for (VerticalLayout tile : allTiles) {
        tile.removeStyleName("selected-component");
      }
    }

    private void resizeTiles(VerticalLayout tab) {

    }

    @Override
    public void setPropertyDataSource(Property property) {
        super.setPropertyDataSource(property);
        hidden.setPropertyDataSource(property);
    }

     @Override
    public void setValue(String newValue) {
        super.setValue(hidden.getValue());
    }

    @Override
    public String getValue(){
        return super.getValue();
    }

    @Override
    public Class<String> getType() {
        return String.class;
    }

}
