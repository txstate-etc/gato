package edu.txstate.its.gato;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

import org.apache.commons.lang3.StringUtils;

import org.w3c.dom.Element;

public class EventsItem {
  private static final DateFormat inputFormatTimed = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
  private static final DateFormat inputFormatUntimed = new SimpleDateFormat("yyyyMMdd");

  private String status;
  private String title;
  private String description;
  private String image;
  private String link;
  private String facility;
  private String cost;
  private String sponsor;
  private String contact;
  private String calendarUrl;
  private String url;
  private Date startDate;
  private String machineStartDate;
  private String humanStartDate;
  private Date endDate;
  private String machineEndDate;
  private String humanEndDate;
  
  private Element elem;

  public EventsItem(Element elem) {
    this.elem = elem;
  } 

  public boolean isCancelled() {
    if (status == null) {
      status = DomUtils.getTextValue(elem, "status").toLowerCase();
    }
    return "cancelled".equals(status);
  }

  public boolean getShowEndDate() {
    return (getEndDate().getTime() > 0l) && !getStartDate().equals(getEndDate());
  }

  public String getTitle() {
    if (title == null) {
      title = DomUtils.getTextValue(elem, "title");
    }
    return title;
  }

  public String getDescription() {
    if (description == null) {
      description = DomUtils.getTextValue(elem, "html-description", false);
    }
    return description;
  }

  public String getImage() {
    if (image == null) {
      image = "";
      Element attachment = DomUtils.getChildNode(elem, "image");
      if (attachment != null) {
        image = DomUtils.getTextValue(attachment, "url");
      }
    }
    return image;
  }

  public String getLink() {
    if (link == null) {
      link = DomUtils.getTextValue(elem, "url");
    }
    return link;
  }

  public String getFacility() {
    if (facility != null) {
      return facility;
    }

    facility = "";
    
    Element location = DomUtils.getChildNode(elem, "location");
    String url = DomUtils.getTextValue(location, "url");
    if (!StringUtils.isEmpty(url)) {
      facility += "<a href=\"" + url + "\">";
    }
    facility += DomUtils.getTextValue(location, "name");
    String abbr = DomUtils.getTextValue(location, "abbr");
    if (!StringUtils.isEmpty(abbr)) {
      facility += " (" + abbr + ")";
    }
    if (!StringUtils.isEmpty(url)) {
      facility += "</a>";
    }
    String room = DomUtils.getTextValue(elem, "sublocation");
    if (!StringUtils.isEmpty(room)) {
      facility += "; " + room;
    }
    
    return facility;
  }

  public String getCost() {
    if (cost == null) {
      cost = DomUtils.getTextValue(elem, "cost");
    }
    return cost;
  }

  public String getSponsor() {
    if (sponsor == null) {
      sponsor = DomUtils.getTextValue(elem, "sponsor");
    }
    return sponsor;
  }

  public String getContact() {
    if (contact != null) {
      return contact;
    }

    Element elem = DomUtils.getChildNode(this.elem, "contact");
    
    contact = DomUtils.getTextValue(elem, "firstname") + " " + DomUtils.getTextValue(elem, "lastname");
    
    String email = DomUtils.getTextValue(elem, "email");
    if (!StringUtils.isEmpty(email)) {
      contact = "<a href=\"mailto:" + email + "\">" + contact + "</a>";
    }

    String phone = DomUtils.getTextValue(elem, "phone");
    if (!StringUtils.isEmpty(phone)) {
      contact += ", " + phone;
    }
    
    return contact;
  }

  public String getUrl() {
    if (url == null) {
      url = EventsModel.CALENDAR_URL + "/recurrences/" + DomUtils.getTextValue(elem, "id");
    }
    return url;
  }

  public String getCalendarUrl() {
    if (calendarUrl == null) {
      calendarUrl = getUrl() + ".ics";
    }
    return calendarUrl;
  }

  public Date getStartDate() {
    if (startDate == null) {
      startDate = getDate(elem, "starttime");
    }
    return startDate;
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

  public Date getEndDate() {
    if (endDate == null) {
      endDate = getDate(elem, "endtime");
    }
    return endDate;
  }

  public String getMachineEndDate() {
    if (machineEndDate == null) {
      machineEndDate = getMachineDate(getEndDate(), true);
    }
    return machineEndDate;
  }

  public String getHumanEndDate() {
    if (humanEndDate == null) {
      humanEndDate = getHumanDate(getEndDate(), false, true);
    }
    return humanEndDate;
  }

  private static Date getDate(Element elem, String dateLabel) {
    final String dateString = DomUtils.getTextValue(elem, dateLabel);
    
    try {
      inputFormatTimed.setTimeZone(TimeZone.getTimeZone("America/Chicago"));
      return inputFormatTimed.parse(dateString);
    } catch (ParseException e) {
      // couldn't parse with a date
    }
    
    try {
      return inputFormatUntimed.parse(dateString);
    } catch (ParseException e) {
      // couldn't parse without a date
    }
    
    return new Date(0l);
  }

  private static String getMachineDate(Date date, boolean showTime) {
    final DateFormat dateFormat = new SimpleDateFormat( "yyyy-MM-dd" );
    final DateFormat timeFormat = new SimpleDateFormat( "HH:mm:00Z" );
    
    String dateString = dateFormat.format(date);
    
    if (showTime) {
      dateString += "T" + timeFormat.format(date);
    }
    
    return dateString;
  }
  
  private static String getHumanDate(Date date, boolean showDate, boolean showTime) {
    DateFormat dateFormat;

    if (showDate && showTime) {
      dateFormat = new SimpleDateFormat("MMM dd, h:mma");
    } else if (showDate) {
      dateFormat = new SimpleDateFormat ("MMM dd");
    } else if (showTime) {
      dateFormat = new SimpleDateFormat("h:mma");
    } else {
      return "";
    }

    return dateFormat.format(date);       
  }

}
