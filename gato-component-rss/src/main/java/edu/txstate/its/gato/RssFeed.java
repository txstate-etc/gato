package edu.txstate.its.gato;

import java.net.URL;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

public class RssFeed implements Serializable {
  protected List<RssItem> items;
  public RssFeed() {
    items = new ArrayList<RssItem>();
  }

  protected String title;
  public String getTitle() { return title; }
  public void setTitle(String s) { title = s; }

  protected String description;
  public String getDescription() { return description; }
  public void setDescription(String s) { description = s; }

  protected URL thumbnail;
  public URL getThumbnail() { return thumbnail; }
  public void setThumbnail(URL u) { thumbnail = u; }
  public void setThumbnail(String s) { thumbnail = new URL(s); }

  protected URL link;
  public URL getLink() { return link; }
  public void setLink(URL u) { link = u; }
  public void setLink(String s) { link = new URL(s); }

  protected Calendar publishedDate;
  public Calendar getPublishedDate() { return publishedDate; }
  public void setPublishedDate(Calendar d) { publishedDate = d; }

  public List<RssItem> getItems() { return items; }
  public void setItems(List<RssItem> l) { items = l; }
  public void addItem(RssItem item) {
    items.add(item);
  }
}
