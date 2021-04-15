package edu.txstate.its.gato;

import info.magnolia.init.MagnoliaConfigurationProperties;
import info.magnolia.objectfactory.Components;

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
  public static DateFormat machineDateFormat = new SimpleDateFormat( "yyyy-MM-dd" );
  public static DateFormat machineTimeFormat = new SimpleDateFormat( "HH:mm:00Z" );
  public static DateFormat machineMonthFormat = new SimpleDateFormat("yyyyMM");
  public static DateFormat humanMonthFormat = new SimpleDateFormat("MMMM");
  public static DateFormat humanDateTimeFormat = new SimpleDateFormat(" d, h:mma");
  public static DateFormat humanDateFormat = new SimpleDateFormat(" d");
  public static DateFormat humanTimeFormat = new SimpleDateFormat("h:mma");

  private TimeZone defaultTZ;

  public AbstractEventItem() {
    MagnoliaConfigurationProperties mcp = Components.getComponent(MagnoliaConfigurationProperties.class);
    String tz = mcp.getProperty("gato.timezone.default");
    if (StringUtils.isBlank(tz)) tz = "America/Chicago";
    defaultTZ = TimeZone.getTimeZone(tz);
    humanMonthFormat.setTimeZone(defaultTZ);
    humanDateTimeFormat.setTimeZone(defaultTZ);
    humanDateFormat.setTimeZone(defaultTZ);
    humanTimeFormat.setTimeZone(defaultTZ);
  }

  public boolean getShowEndDate() {
    return (getEndDate().getTime() > 0l) && !getStartDate().equals(getEndDate());
  }

  public String getMachineStartDate() {
    return getMachineDate(getStartDate(), true);
  }

  public String getHumanStartDate() {
    return getHumanDate(getStartDate(), true, true);
  }

  public String getMachineEndDate() {
    return getMachineDate(getEndDate(), true);
  }

  public String getHumanEndDate() {
    boolean showEndDate = !getMachineDate(getStartDate(), false).equals(getMachineDate(getEndDate(), false));
    return getHumanDate(getEndDate(), showEndDate, true);
  }

  public String getAllDayDate() {
    return getHumanDate(getStartDate(), true, false);
  }

  public String getMachineMonth() {
    return machineMonthFormat.format(getStartDate());
  }

  protected static String getMachineDate(Date date, boolean showTime) {
    String dateString = machineDateFormat.format(date);

    if (showTime) {
      dateString += "T" + machineTimeFormat.format(date);
    }

    return dateString;
  }

  protected static String getHumanDate(Date date, boolean showDate, boolean showTime) {
    String abbrMonth = "";
    if(showDate){
      abbrMonth = abbreviateMonth(humanMonthFormat.format(date));
    }

    DateFormat dateFormat;
    if (showDate && showTime) {
      dateFormat = humanDateTimeFormat;
    } else if (showDate) {
      dateFormat = humanDateFormat;
    } else if (showTime) {
      dateFormat = humanTimeFormat;
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
