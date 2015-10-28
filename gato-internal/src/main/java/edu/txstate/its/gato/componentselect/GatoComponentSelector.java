package edu.txstate.its.gato.componentselect;

import com.vaadin.ui.CustomField;
import com.vaadin.ui.VerticalLayout;
import com.vaadin.ui.HorizontalLayout;
import com.vaadin.ui.GridLayout;
import com.vaadin.ui.TextField;
import com.vaadin.ui.Label;
import com.vaadin.ui.Component;
import com.vaadin.data.Property;
import com.vaadin.annotations.StyleSheet;
import com.vaadin.server.ExternalResource;
import com.vaadin.ui.Image;

import java.util.ArrayList;
import java.util.List;
import java.util.Iterator;
import org.apache.commons.lang3.StringUtils;

import com.vaadin.event.LayoutEvents.LayoutClickEvent;
import com.vaadin.event.LayoutEvents.LayoutClickListener;

@StyleSheet("vaadin://css/componentselect.css")
public class GatoComponentSelector extends CustomField<String>{

    private static final String ICON_HEIGHT = "108px";

    private List<GatoComponentSelectOption> templates;

    private VerticalLayout rootLayout = new VerticalLayout();
    private GridLayout grid = new GridLayout();
    private TextField hidden = new TextField();


    public GatoComponentSelector(ArrayList<GatoComponentSelectOption> templates){
        this.templates = templates;
    }

    //The component is built using several horizonal layouts instead of a GridLayout
    //component because the GridLayout sometimes overlaps the components.
    @Override
    protected Component initContent() {
        int numColumns = 2;
        // grid.setColumns(2);  
        // grid.setSpacing(true);
        // grid.setSizeFull();
        int numTemplates = templates.size();
        int numRows = (numTemplates + (numColumns -1)) / numColumns;
        int templateIndex = 0;

        for(int i=0; i<numRows; i++){
            HorizontalLayout hl = new HorizontalLayout();
            hl.setSpacing(true);
            hl.setSizeFull();
            hl.addStyleName("component-row");
            for(int j=0; j<numColumns && templateIndex < numTemplates; j++){
                hl.addComponent(buildGridComponent(templates.get(templateIndex)));
                templateIndex++;
            }
            //add empty labels to make sure last row elements are not extra wide
            if(i == numRows-1){
                int emptySpaces = numColumns - (numTemplates % numColumns);
                for(int k=0; k<emptySpaces; k++){
                    hl.addComponent(new Label("&nbsp;", Label.CONTENT_XHTML));
                }
            }
            rootLayout.addComponent(hl);
        }
        //keeping this just in case the gridlayout, although broken, is better
        // for (GatoComponentSelectOption template : templates) {
        //     grid.addComponent(buildGridComponent(template));
        //     //rootLayout.addComponent(buildGridComponent(template));
        // }
        // System.out.println("*** The Grid has " + grid.getComponentCount() + " components.");
        // rootLayout.addComponent(grid);
        hidden.setVisible(false);
        rootLayout.addComponent(hidden);
        return rootLayout;
    }

    //build an individual "cell."  Each cell has a title, description,
    //and icon.  If there is no icon, then just the title and description are displayed.
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
        String textHtml = "<div class=\"component-text\">" + titleHtml + descriptionHtml + "</div>";
        Label textContent = new Label(textHtml, Label.CONTENT_XHTML);
        //titleLabel.addStyleName("component-title");
        textContent.setSizeFull();
        tile.addComponent(textContent);

        // Label descriptionLabel = new Label(template.getDescription()+ "\n");
        // descriptionLabel.addStyleName("component-description");
        // descriptionLabel.setSizeFull();
        // tile.addComponent(descriptionLabel);
        
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
        return tile;
    }

    //remove the "selected-component" style name from all components
    //so only one appears selected at a time
    private void removeSelectedStyleFromComponents(){
        Iterator<Component> rootIterator = rootLayout.iterator();
        while(rootIterator.hasNext()){
            Component c = rootIterator.next();
            if(c instanceof HorizontalLayout){
                HorizontalLayout h = (HorizontalLayout) c;
                Iterator<Component> rowIterator = h.iterator();
                while(rowIterator.hasNext()){
                    Component rc = rowIterator.next();
                    if(rc instanceof VerticalLayout){
                        VerticalLayout v = (VerticalLayout) rc;
                        v.removeStyleName("selected-component");
                    }
                    
                }
            }
        }
        // keeping this for now
        // Iterator<Component> iter = grid.iterator();
        // while(iter.hasNext()){
        //     Component c = iter.next();
        //     if(c instanceof VerticalLayout){
        //         VerticalLayout h = (VerticalLayout) c;
        //         h.removeStyleName("selected-component");
        //         //Label l = (Label) h.getComponent(0);
        //         //l.removeStyleName("selected-component");
        //     }
        // }

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