package edu.txstate.its.gato;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;
import java.util.List;
import java.util.ArrayList;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

import com.google.gson.*;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.StringEscapeUtils;

public class TrumbaEventItem extends AbstractEventItem {
  private static final DateFormat inputFormatTimed = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");
  protected JsonObject event;
  protected static final Pattern HREF_PATTERN = Pattern.compile(".*href=\"([^\"]*)\".*", Pattern.CASE_INSENSITIVE);
  protected static final Pattern LINK_PATTERN = Pattern.compile("(https?://\\S+)", Pattern.CASE_INSENSITIVE);

  public TrumbaEventItem(JsonObject event) {
    this.event = event;
  }

  /* X-TRUMBA-CUSTOMFIELD;NAME="Event image";ID=4;TYPE=Image:https://www.trumba.com/i/DgBeZ7jZpug65L6HHgEeg4fh.jpg */
  public String getCustomProperty(String customName) {
    if (event.getAsJsonArray("customFields") != null) {
      for (JsonElement f : event.getAsJsonArray("customFields")) {
        JsonObject field = f.getAsJsonObject();
        if (customName.equals(field.getAsJsonPrimitive("label").getAsString())) return field.getAsJsonPrimitive("value").getAsString();
      }
    }
    return "";
  }

  public String getPropertyString(String name) {
    if (!event.has(name)) return "";
    return event.getAsJsonPrimitive(name).getAsString();
  }
  public boolean getPropertyBool(String name) {
    if (!event.has(name)) return false;
    return event.getAsJsonPrimitive(name).getAsBoolean();
  }

  public boolean isCancelled() {
    return getPropertyBool("canceled");
  }

  public String getTitle() {
    return getPropertyString("title");
  }

  public String getDescription() {
    return getPropertyString("description");
  }

  public String getImage() {
    if (event.has("detailImage")) {
      return event.getAsJsonObject("detailImage").getAsJsonPrimitive("url").getAsString();
    }
    if (event.has("eventImage")) {
      return event.getAsJsonObject("eventImage").getAsJsonPrimitive("url").getAsString();
    }
    return "";
  }

  public String getLink() {
    String linkhtml = getPropertyString("webLink");
    Matcher m = HREF_PATTERN.matcher(linkhtml);
    if (m.matches()) return StringEscapeUtils.unescapeHtml4(m.group(1));
    else if (LINK_PATTERN.matcher(linkhtml).matches()) return linkhtml;
    return "";
  }

  public String getFacility() {
    String facility = getPropertyString("location");
    String room = getCustomProperty("Room");
    if (!StringUtils.isBlank(room)) {
      if (!StringUtils.isBlank(facility)) facility += "; ";
      facility += room;
    }

    return facility;
  }

  public String getCost() {
    return getCustomProperty("Cost");
  }

  public String getSponsor() {
    return getCustomProperty("Sponsor");
  }

  public String getContact() {
    return getCustomProperty("Contact");
  }

  public String getUrl() {
    return getPropertyString("permaLinkUrl");
  }

  public String getCalendarUrl() {
    return getPropertyString("eventActionUrl");
  }

  public String getRsvpUrl() {
    return getPropertyString("signUpUrl");
  }

  protected Date getDate(String propertyname, String tzname) {
    final String dateString = getPropertyString(propertyname);
    final String tz = getPropertyString(tzname);

    try {
      return inputFormatTimed.parse(dateString+tz);
    } catch (ParseException e) {
      // couldn't parse with a date
    }
    return new Date(0l);
  }

  public Date getStartDate() {
    return getDate("startDateTime", "startTimeZoneOffset");
  }

  public Date getEndDate() {
    return getDate("endDateTime", "endTimeZoneOffset");
  }

  public String getEventId() {
    return getTitle();
  }

  public String getRecurrenceId() {
    return getPropertyString("eventID");
  }

  public List<String> getCategories() {
    List categories = new ArrayList<String>();
    for (String cat : getCustomProperty("Event Type").split(", ")) {
      categories.add(cat);
    }
    return categories;
  }
}
