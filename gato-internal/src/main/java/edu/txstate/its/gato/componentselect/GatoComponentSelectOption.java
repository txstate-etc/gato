package edu.txstate.its.gato.componentselect;

/*
* An object used to store information about a paragraph/component
*/
public class GatoComponentSelectOption{
    private String componentId;
    private String title;
    private String description;
    private String iconPath;
    private String tabName;

    public String getComponentId(){
        return componentId;
    }

    public void setComponentId(String id){
        this.componentId = id;
    }

    public String getTitle(){
        return title;
    }

    public void setTitle(String title){
        this.title = title;
    }

    public String getDescription(){
        return description;
    }

    public void setDescription(String description){
        this.description = description;
    }

    public String getIconPath(){
        return this.iconPath;
    }

    public void setIconPath(String path){
        this.iconPath = path;
    }

    public String getTabName() {
      return this.tabName;
    }

    public void setTabName(String tabName) {
      this.tabName = tabName;
    }
}
