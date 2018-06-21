package edu.txstate.its.gato;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;
import java.util.List;
import java.util.ArrayList;

import org.apache.commons.lang3.StringUtils;

import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

abstract class AbstractEventItem implements EventItem {
  protected String cost;
  protected String sponsor;
  protected String contact;
  protected String calendarUrl;
  protected String url;
  protected Date startDate;
  protected String machineStartDate;
  protected String humanStartDate;
  protected Date endDate;
  protected String machineEndDate;
  protected String humanEndDate;
  protected String eventId;
  protected String recurrenceId;
  protected List<String> categories;

  public AbstractEventItem() {

  }

  public boolean getShowEndDate() {
    return (getEndDate().getTime() > 0l) && !getStartDate().equals(getEndDate());
  }

  public String getCalendarUrl() {
    if (calendarUrl == null) {
      calendarUrl = getUrl() + ".ics";
    }
    return calendarUrl;
  }

  public String getMachineStartDate() {
    if (machineStartDate == null) {
      machineStartDate = getMachineDate(getStartDate(), true);
    }
    return machineStartDate;
  }

  public String getHumanStartDate() {
    if (humanStartDate == null) {
      humanStartDate = getHumanDate(getStartDate(), true, true);
    }
    return humanStartDate;
  }

  public String getMachineEndDate() {
    if (machineEndDate == null) {
      machineEndDate = getMachineDate(getEndDate(), true);
    }
    return machineEndDate;
  }

  public String getHumanEndDate() {
    boolean showEndDate = !getMachineDate(getStartDate(), false).equals(getMachineDate(getEndDate(), false));
    return getHumanDate(getEndDate(), showEndDate, true);
  }

  public static DateFormat machineMonthFormat = new SimpleDateFormat("yyyyMM");
  public String getMachineMonth() {
    return machineMonthFormat.format(getStartDate());
  }

  protected static String getMachineDate(Date date, boolean showTime) {
    final DateFormat dateFormat = new SimpleDateFormat( "yyyy-MM-dd" );
    final DateFormat timeFormat = new SimpleDateFormat( "HH:mm:00Z" );

    String dateString = dateFormat.format(date);

    if (showTime) {
      dateString += "T" + timeFormat.format(date);
    }

    return dateString;
  }

  protected static String getHumanDate(Date date, boolean showDate, boolean showTime) {
    DateFormat dateFormat;
    String abbrMonth = "";

    if(showDate){
      abbrMonth = abbreviateMonth(new SimpleDateFormat("MMMM").format(date));
    }

    if (showDate && showTime) {
      dateFormat = new SimpleDateFormat(" dd, h:mma");
    } else if (showDate) {
      dateFormat = new SimpleDateFormat (" dd");
    } else if (showTime) {
      dateFormat = new SimpleDateFormat("h:mma");
    } else {
      return "";
    }

    return abbrMonth + dateFormat.format(date);
  }

  //University Marketing is very specific about their preferred month abbreviations
  protected static String abbreviateMonth(String month){
    String abbr = "";
    switch(month.toLowerCase()){
      case "january":
        abbr = "Jan.";
        break;
      case "february":
        abbr = "Feb.";
        break;
      case "august":
        abbr = "Aug.";
        break;
      case "september":
        abbr = "Sept.";
        break;
      case "october":
        abbr = "Oct.";
        break;
      case "november":
        abbr = "Nov.";
        break;
      case "december":
        abbr = "Dec.";
        break;
      case "march":
      case "april":
      case "may":
      case "june":
      case "july":
      default:
        abbr = month;
        break;
    }
    return abbr;
  }

  public String getCategoryJson() {
    List<String> categories = getCategories();
    String last = categories.get(categories.size() - 1);
    StringBuilder json = new StringBuilder();
    json.append("[");
    for (String c : categories) {
      json.append("\""+c+"\"");
      if (!c.equals(last)) json.append(",");
    }
    json.append("]");
    return json.toString();
  }

  public int compareTo(EventItem other) {
    return getRecurrenceId().compareTo(other.getRecurrenceId());
  }

}
