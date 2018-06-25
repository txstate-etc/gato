package edu.txstate.its.gato;

import java.util.Date;
import java.util.List;

public interface EventItem extends Comparable<EventItem> {
  public boolean isCancelled();
  public boolean getShowEndDate();
  public String getTitle();
  public String getDescription();
  public String getImage();
  public String getLink();
  public String getFacility();
  public String getCost();
  public String getSponsor();
  public String getContact();
  public String getUrl();
  public String getCalendarUrl();
  public String getRsvpUrl();
  public Date getStartDate();
  public String getMachineStartDate();
  public String getHumanStartDate();
  public Date getEndDate();
  public String getMachineEndDate();
  public String getHumanEndDate();
  public String getMachineMonth();
  public String getEventId();
  public String getRecurrenceId();
  public List<String> getCategories();
  public String getCategoryJson();
}
