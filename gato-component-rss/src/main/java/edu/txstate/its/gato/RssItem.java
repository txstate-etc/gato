package edu.txstate.its.gato;

import java.io.Serializable;
import java.net.URL;
import java.util.Calendar;

import org.apache.commons.lang3.StringUtils;

public class RssItem implements Serializable {
  public RssItem() {
  }

  protected String guid;
  public String getGuid() { return guid; }
  public void setGuid(String s) { guid = s; }
  public String getCleanGuid() {
    if (StringUtils.isBlank(guid)) return "";
    return "g"+guid.replaceAll("\\W+", "-");
  }

  protected Calendar publishedDate;
  public Calendar getPublishedDate() { return publishedDate; }
  public void setPublishedDate(Calendar d) { publishedDate = d; }

  protected String title;
  public String getTitle() { return title; }
  public void setTitle(String s) { title = s; }

  protected String description;
  public String getDescription() { return description; }
  public void setDescription(String s) { description = s; }

  protected String content;
  public String getContent() { return content; }
  public void setContent(String s) { content = s; }

  protected String thumbnail;
  public String getThumbnail() { return thumbnail; }
  public void setThumbnail(String s) { thumbnail = s; }

  protected URL link;
  public URL getLink() { return link; }
  public void setLink(URL u) { link = u; }
  public void setLink(String s) { try { link = new URL(s); } catch (Exception e) { /* no action */ } }

  protected String author;
  public String getAuthor() { return author; }
  public void setAuthor(String s) { author = s; }

}
