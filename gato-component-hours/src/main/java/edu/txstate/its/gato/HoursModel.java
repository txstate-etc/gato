package edu.txstate.its.gato;

import info.magnolia.init.MagnoliaConfigurationProperties;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.template.RenderableDefinition;
import info.magnolia.objectfactory.Components;
import java.util.Calendar;
import java.text.SimpleDateFormat;
import java.text.DateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;
import javax.inject.Inject;
import javax.jcr.Node;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.commons.lang3.StringUtils;

public class HoursModel extends TrumbaEventModel {
  protected final DateFormat jsonFormat = new SimpleDateFormat( "yyyy-MM-dd'T'HH:mm:ssZ" );
  protected final DateFormat fullDateFormat = new SimpleDateFormat( "MMMM d" );
  protected final DateFormat shortDateFormat = new SimpleDateFormat( "EEEE" );
  protected final DateFormat fullTimeFormat = new SimpleDateFormat( "h:mma" );
  protected final DateFormat shortTimeFormat = new SimpleDateFormat( "ha" );
  protected String defaultCalendarId = "1411151";
  protected String specialTitle;
  protected String displayTitle;

  @Inject
  public HoursModel(Node content, RenderableDefinition definition, RenderingModel parent) {
    super(content, definition, parent);
    this.specialTitle = PropertyUtil.getString(content, "caltitle", "");
    this.displayTitle = PropertyUtil.getString(content, "displaytitle", "");
    MagnoliaConfigurationProperties mcp = Components.getComponent(MagnoliaConfigurationProperties.class);
    String tz = mcp.getProperty("gato.timezone.default");
    if (StringUtils.isBlank(tz)) tz = "America/Chicago";
    TimeZone defaulttz = TimeZone.getTimeZone(tz);
    jsonFormat.setTimeZone(defaulttz);
    fullDateFormat.setTimeZone(defaulttz);
    shortDateFormat.setTimeZone(defaulttz);
    fullTimeFormat.setTimeZone(defaulttz);
    shortTimeFormat.setTimeZone(defaulttz);
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
    if (fullDate) return fullDateFormat.format(date);
    return shortDateFormat.format(date);
  }

  private String formatTime(Date date) {
    DateFormat df;
    if (date.getMinutes() > 0) df = fullTimeFormat;
    else df = shortTimeFormat;
    return df.format(date).toLowerCase(Locale.ENGLISH);
  }

  private String formatOpen(Date dateClose, Date nextOpen) {
    String html = "<span class=\"open-closed\">";
    if (nextOpen != null && dateClose.equals(nextOpen)) {
      return html+"Open</span> 24hrs";
    }
    return html+"Open</span> until " + formatTime(dateClose);
  }

  private String formatClosed(Date nextOpen) {
    String time = "<span class=\"open-closed\">Closed</span>";
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

  protected String constructUrl () {
    String url = baseUrl();

    Calendar startDate = Calendar.getInstance();
    Calendar endDate = Calendar.getInstance();
    startDate.add( Calendar.DATE, -1 );
    endDate.add( Calendar.DATE, 94 );
    endDate.set( Calendar.DAY_OF_MONTH, 1 );

    url = url + "?startdate=" + trumbaformat.format(startDate.getTime());
    url = url + "&enddate=" + trumbaformat.format(endDate.getTime());
    return url;
  }

  public boolean itemIsApplicable(EventItem item) {
    return !item.isCancelled() &&
        // if we are looking for a special title and this item does not match, skip it
        (StringUtils.isBlank(this.specialTitle) || item.getTitle().equalsIgnoreCase(this.specialTitle));
  }

  public boolean isOpen() {
    for ( EventItem item : (List<EventItem>)this.items ) {
      if (itemIsApplicable(item)
        && isBetween(new Date(), item.getStartDate(), item.getEndDate()))
          return true;
    }
    return false;
  }

  // Examples:
  // "Open until 3am"
  // "Open 24hrs"
  // "Closed until 7am"
  // "Closed until 7am Monday"
  // "Closed until 7am, January 3"
  // "Closed" (Shouldn't ever happen)
  public String getAbbreviated() {
    if (this.items.size() == 0) return "No hours data.";
    String html = "";
    Date now = Calendar.getInstance().getTime();
    Date firstOpen = null;
    Date firstClose = null;
    Date secondOpen = null;
    Date secondClose = null;
    Date thirdOpen = null;
    Date thirdClose = null;

    if (!StringUtils.isBlank(this.displayTitle)) {
      html += this.displayTitle + " is ";
    }

    // Find the next three open/close times (starting yesterday)
    for ( EventItem item : (List<EventItem>)this.items ) {
      if (!itemIsApplicable(item)) continue;
      if (item.getEndDate().before(now)) continue;

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
      return "Closed";
    }

    if (firstOpen.after(now)) {
      // a. closed now, return next opening
      return html+formatClosed(firstOpen);
    }

    if (firstOpen.before(now) && firstClose.after(now)) {
      // b. open now. return "Open until hh:mm p"
      return html+formatOpen(firstClose, secondOpen);
    }

    if (secondOpen == null || secondOpen.after(now)) {
      // c. closed now, return next opening
      return html+formatClosed(secondOpen);
    }

    if (secondOpen.before(now) && secondClose.after(now)) {
      // d. open now. return "Open until hh:mm p"
      return html+formatOpen(secondClose, thirdOpen);
    }

    if (thirdOpen == null || thirdOpen.after(now)) {
      // e. closed now, return next opening
      return html+formatClosed(thirdOpen);
    }

    // The next two states should never happen?
    // It would mean there were two events on the same day

    if (thirdOpen.before(now) && thirdClose.after(now)) {
      // f. open now. return "Open until hh:mm p"
      return html+formatOpen(thirdClose, null);
    }

    if (thirdClose.before(now)) {
      // g. return 'closed'
      return html+formatClosed(null);
    }

    // really should never happen
    return "";
  }

  public String getFull() {
    if (this.items.size() == 0) return "No hours data.";
    String out="";
    for ( EventItem item : (List<EventItem>) this.items) {
      if (isToday(item.getStartDate())) {
        out += itemHtml( item );
      }
    }
    return out;
  }

  public String getData(){
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
