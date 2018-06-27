package edu.txstate.its.gato;

import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.template.RenderableDefinition;
import javax.inject.Inject;
import javax.jcr.Node;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import java.util.Calendar;
import java.text.SimpleDateFormat;
import java.text.DateFormat;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.Locale;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.commons.lang3.StringUtils;


public class HoursModel extends TrumbaEventModel {
  protected final DateFormat jsonFormat = new SimpleDateFormat( "yyyy-MM-dd'T'HH:mm:ss" );

  @Inject
  public HoursModel(Node content, RenderableDefinition definition, RenderingModel parent) {
    super(content, definition, parent);
  }

  public String itemHtml( EventItem item ) {
    Date startDate = item.getStartDate();
    Date endDate = item.getEndDate();

    String itemHtml = "";

    itemHtml += "<div class=\"hours\">";
    itemHtml += "<h4>" + item.getTitle() + "</h4>";
    itemHtml += "<div class=\"times\">";

    if (item.isCancelled()) {
      itemHtml += "closed";
    } else if (startDate.getHours() == endDate.getHours() && startDate.getMinutes() == endDate.getMinutes()) {
      itemHtml += "24 hours";
    } else {
      itemHtml += formatTime(startDate);
      itemHtml += " - ";
      itemHtml += formatTime(endDate);
    }

    itemHtml += "</div>";
    itemHtml += "</div>";

    return itemHtml;
  }

  public String itemJson( EventItem item ) {
    String title = item.getTitle();
    Date startDate = item.getStartDate();
    Date endDate = item.getEndDate();

    String json = "";

    json += "{";
    json += "\"title\":\"" + title.replace("\"", "\\\"") + "\",";

    if (item.isCancelled()) {
      json += "\"className\":\"canceled\",";
    }
    json += "\"start\":\""+jsonFormat.format(startDate)+"\",";
    json += "\"end\":\""+jsonFormat.format(endDate)+"\"";

    json += "}";
    return json;
  }

  private boolean isBetween(Date now, Date start, Date end) {
    Calendar nowc = Calendar.getInstance();
    nowc.setTime(now);
    Calendar startc = Calendar.getInstance();
    startc.setTime(start);
    Calendar endc = Calendar.getInstance();
    endc.setTime(end);
    return nowc.before(endc) && nowc.after(startc);
  }

  private boolean isToday(Date d) {
    Calendar dc = Calendar.getInstance();
    dc.setTime(d);
    Calendar nowc = Calendar.getInstance();
    return DateUtils.isSameDay(dc, nowc);
  }

  private String formatDate(Date date, boolean fullDate) {
    SimpleDateFormat df;
    if (fullDate) {
      df = new SimpleDateFormat("MMMM d");
    } else {
      df = new SimpleDateFormat("EEEE");
    }
    return df.format(date);
  }

  private String formatTime(Date date) {
    SimpleDateFormat df;
    if (date.getMinutes() > 0) {
      df = new SimpleDateFormat("h:mma");
    } else {
      df = new SimpleDateFormat("ha");
    }
    return df.format(date).toLowerCase(Locale.ENGLISH);
  }

  private String formatOpen(Date dateClose, Date nextOpen) {
    if (nextOpen != null && dateClose.equals(nextOpen)) {
      return "Open 24hrs";
    }
    return "Open until " + formatTime(dateClose);
  }

  private String formatClosed(Date nextOpen) {
    String time = "Closed";
    if (nextOpen != null) {
      time += " until " + formatTime(nextOpen);
      Calendar cutoff = Calendar.getInstance();
      cutoff.add( Calendar.DATE, 1 );
      if (nextOpen.after(cutoff.getTime())) {
        cutoff.add( Calendar.DATE, 6 );
        boolean fullDate = nextOpen.after(cutoff.getTime());
        time += fullDate ? ", " : " ";
        time += formatDate(nextOpen, fullDate);
      }
    }
    return time;
  }

  // Examples:
  // "Open until 3am"
  // "Open 24hrs"
  // "Closed until 7am"
  // "Closed until 7am Monday"
  // "Closed until 7am, January 3"
  // "Closed" (Shouldn't ever happen)
  private String mobileHoursHtml(List<EventItem> items) {
    String html = "";
    Date now = Calendar.getInstance().getTime();
    Date firstOpen = null;
    Date firstClose = null;
    Date secondOpen = null;
    Date secondClose = null;
    Date thirdOpen = null;
    Date thirdClose = null;

    // Find the next three open/close times (starting yesterday)
    for ( EventItem item : items ) {
      // FIXME: don't hardcode the title, put it in the JCR (but default it to this)
      if (!item.getTitle().equalsIgnoreCase("Alkek Library") || item.isCancelled()) {
        continue;
      }

      if (firstOpen == null) {
        firstOpen = item.getStartDate();
        firstClose = item.getEndDate();
      } else if (secondOpen == null) {
        secondOpen = item.getStartDate();
        secondClose = item.getEndDate();
      } else {
        thirdOpen = item.getStartDate();
        thirdClose = item.getEndDate();
        break;
      }
    }

    // Timeline of the three openings and the various states
    // we can be in relative to the current time.
    // Usually the 3 openings are yesterday, today, and tomorrow,
    // but may be different during holidays, etc.
    //   a  b  c  d  e  f  g
    // <---###---###---###--->
    //      1     2     3

    if (firstOpen == null) {
      // a'. No known times; maybe they stopped entering them? Just return blank
      return "";
    }

    if (firstOpen.after(now)) {
      // a. closed now, return next opening
      return formatClosed(firstOpen);
    }

    if (firstOpen.before(now) && firstClose.after(now)) {
      // b. open now. return "Open until hh:mm p"
      return formatOpen(firstClose, secondOpen);
    }

    if (secondOpen == null || secondOpen.after(now)) {
      // c. closed now, return next opening
      return formatClosed(secondOpen);
    }

    if (secondOpen.before(now) && secondClose.after(now)) {
      // d. open now. return "Open until hh:mm p"
      return formatOpen(secondClose, thirdOpen);
    }

    if (thirdOpen == null || thirdOpen.after(now)) {
      // e. closed now, return next opening
      return formatClosed(thirdOpen);
    }

    // The next two states should never happen?
    // It would mean there were two events on the same day

    if (thirdOpen.before(now) && thirdClose.after(now)) {
      // f. open now. return "Open until hh:mm p"
      return formatOpen(thirdClose, null);
    }

    if (thirdClose.before(now)) {
      // g. return 'closed'
      return formatClosed(null);
    }

    // really should never happen
    return "";
  }

  private String constructUrl (Boolean mobileDevice, String calendarId) {
    String url = baseUrl(content, "1411153");

    Calendar startDate = Calendar.getInstance();
    Calendar endDate = Calendar.getInstance();
    startDate.add( Calendar.DATE, -1 );
    endDate.add( Calendar.DATE, 94 );
    endDate.set( Calendar.DAY_OF_MONTH, 1 );
    endDate.add( Calendar.DATE, -1);

    url = url + "?startdate=" + trumbaformat.format(startDate.getTime());
    url = url + "&enddate=" + trumbaformat.format(endDate.getTime());
    return url;
  }

  public String getEvents(Boolean isMobile){
    if (this.items.size() == 0) return "No hours data.";
    String out="";
    if(isMobile){
      out = mobileHoursHtml(this.items);
    } else {
      Date now = new Date();
      for ( EventItem item : (List<EventItem>) this.items) {
        if (isToday(item.getStartDate())) {
          out += itemHtml( item );
        }
      }
    }
    return out;
  }

  public String getFullCalendar(String calendarId){
    String out = "[";
    boolean firstrun = true;
    for ( EventItem item : (List<EventItem>) this.items ) {
      if (!firstrun) out += ",";
      out += itemJson( item );
      firstrun = false;
    }
    return out+"]";
  }

  public boolean showEvent(Calendar endDate){
      return (endDate.getTimeInMillis() > Calendar.getInstance().getTimeInMillis());
  }

}
