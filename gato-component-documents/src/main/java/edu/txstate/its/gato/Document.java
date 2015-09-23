package edu.txstate.its.gato;

public class Document{
    private String iconClass;
    private String title;
    private String extension;
    private String fileSize;
    private String path;
    private String subject;
    private String description;
    private boolean brokenLink = false;

    public String getIconClass(){
        return this.iconClass;
    }
    public String getTitle(){
        return this.title;
    }
    public String getExtension(){
        return this.extension;
    }
    public String getFileSize(){
        return this.fileSize;
    }
    public String getPath(){
        return this.path;
    }
    public String getSubject(){
        return this.subject;
    }
    public String getDescription(){
        return this.description;
    }
    public boolean isBrokenLink(){
        return this.brokenLink;
    }

    public void setBrokenLink(boolean brokenLink){
        this.brokenLink = brokenLink;
    }

    public void setIconClass(String iconClass){
        this.iconClass = iconClass;
    }
    public void setTitle(String title){
        this.title = title;
    }
    public void setExtension(String extension){
        this.extension = extension;
    }
    public void setFileSize(String fileSize){
        this.fileSize = fileSize;
    }
    public void setPath(String path){
        this.path = path;
    }
    public void setSubject(String subject){
        this.subject = subject;
    }
    public void setDescription(String description){
        this.description = description;
    }
}

