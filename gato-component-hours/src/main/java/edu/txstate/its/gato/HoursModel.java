package edu.txstate.its.gato;

import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.model.RenderingModelImpl;
import info.magnolia.rendering.template.RenderableDefinition;
import javax.inject.Inject;
import javax.jcr.Node;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import java.io.UnsupportedEncodingException;
import java.util.Calendar;
import java.text.SimpleDateFormat;
import java.text.DateFormat;
import java.util.Date;
import java.util.TimeZone;
import java.util.Locale;
import org.apache.commons.lang3.time.DateUtils;


public class HoursModel<RD extends RenderableDefinition> extends RenderingModelImpl<RD> {

    public static final String CALENDAR_URL = "http://etcalendar.its.txstate.edu";
    DateFormat inputFormatTimed = new SimpleDateFormat( "yyyy-MM-dd'T'HH:mm:ss" );
    DateFormat inputFormatUntimed = new SimpleDateFormat( "yyyyMMdd" );
    public Document rssDocument;

    @Inject
    public HoursModel(Node content, RD definition, RenderingModel<?> parent) {
        super(content, definition, parent);
        try {
          String url = constructUrl(true);
          System.out.println("<!-- USING URL : "+ url + "-->");
          rssDocument = DomUtils.parseXml( url );
        } catch (Exception e) {
          e.printStackTrace();
        }
    }

    public String itemHtml( Element item ) throws UnsupportedEncodingException {
        String title = getTitle( item ).trim();

        Date startDate = getDate( item, "starttime" );
        Date endDate = getDate( item, "endtime" );

        String itemHtml = "";

        itemHtml += "<div class=\"hours\">";
        itemHtml += "<h4>" + title + "</h4>";
        itemHtml += "<div class=\"times\">";

        if (isCancelled(item)) {
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

    public String itemJson( Element item ) throws UnsupportedEncodingException {
        String title = getTitle( item ).trim();

        Date startDate = getDate( item, "starttime" );
        Date endDate = getDate( item, "endtime" );

        String json = "";

        json += "{";
        json += "\"title\":\"" + title.replace("\"", "\\\"") + "\",";

        if (isCancelled(item)) {
            json += "\"className\":\"canceled\",";
        }
        json += "\"start\":\""+inputFormatTimed.format(startDate)+"\",";
        json += "\"end\":\""+inputFormatTimed.format(endDate)+"\"";

        json += "}";
        return json;
    }

    private Date getDate( Element item, String dateLabel ) {

        String dateString = DomUtils.getTextValue( item, dateLabel );
        try {
        inputFormatTimed.setTimeZone(TimeZone.getTimeZone("America/Chicago"));
            return inputFormatTimed.parse( dateString );
        } catch ( java.text.ParseException e ) {
            // couldn't parse with a date
        }

        try {
            return inputFormatUntimed.parse( dateString );
        } catch ( java.text.ParseException e ) {
            // couldn't parse without a date
        }
    return null;
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

    private boolean isCancelled ( Element item ) {
        boolean isCancelled = "cancelled".equals( DomUtils.getTextValue( item, "status" ).toLowerCase() );
        return isCancelled;
    }

    private String getTitle ( Element item ) {
        return DomUtils.getTextValue( item, "title" );
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
    private String mobileHoursHtml(NodeList items) {
        String html = "";
        Date now = Calendar.getInstance().getTime();
        Date firstOpen = null;
        Date firstClose = null;
        Date secondOpen = null;
        Date secondClose = null;
        Date thirdOpen = null;
        Date thirdClose = null;

        // Find the next three open/close times (starting yesterday)
        for ( int i = 0; i < items.getLength(); i++ ) {
            Element item = (Element)items.item(i);
            String title = getTitle( item ).trim();

            // FIXME: don't hardcode the title, put it in the JCR (but default it to this)
            if (!title.equalsIgnoreCase("Alkek Library") || isCancelled(item)) {
                continue;
            }

            if (firstOpen == null) {
                firstOpen = getDate( item, "starttime" );
                firstClose = getDate( item, "endtime" );
            } else if (secondOpen == null) {
                secondOpen = getDate( item, "starttime" );
                secondClose = getDate( item, "endtime" );
            } else {
                thirdOpen = getDate( item, "starttime" );
                thirdClose = getDate( item, "endtime" );
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

    private String constructUrl (Boolean mobileDevice ) throws UnsupportedEncodingException {
        String calendarId = "/division-of-information-technology-meta-calendar/alkek-library/library-hours";
        String url = CALENDAR_URL + "/search.xml?b=de&path="+java.net.URLEncoder.encode(calendarId, "UTF-8");

        Calendar startDate = Calendar.getInstance();
        Calendar endDate = Calendar.getInstance();
        if ( mobileDevice ) {
            startDate.add( Calendar.DATE, -1 );
            endDate.add( Calendar.DATE, 30 );
        }

        url = url + "&year=" + startDate.get( Calendar.YEAR );
        url = url + "&month=" + ( startDate.get( Calendar.MONTH ) + 1 );
        url = url + "&day=" + startDate.get( Calendar.DATE );

        url = url + "&end_year=" + endDate.get( Calendar.YEAR );
        url = url + "&end_month=" + ( endDate.get( Calendar.MONTH ) + 1 );
        url = url + "&end_day=" + endDate.get( Calendar.DATE );

        return url;
    }


    public String getEvents(Boolean isMobile){
        String out="";
        try{
            if(rssDocument != null){
                Element root = rssDocument.getDocumentElement();
                NodeList items = root.getElementsByTagName( "object");
                if(isMobile){
                    out = mobileHoursHtml(items);
                }
                else{
                    Date now = new Date();
                    for ( int i = 0; i < items.getLength(); i++ ) {
                      Element thisItem = (Element)items.item(i);
                      if (isToday(getDate(thisItem, "starttime"))) {
                        out += itemHtml( thisItem );
                      }
                    }
                }
                if (items.getLength() == 0) out = "No hours data.";

            }
            else{
                out = "There was an error retrieving hours.";
            }
            return out;
        }
        catch(UnsupportedEncodingException e){
            e.printStackTrace();
            return "There was an error retrieving hours.";
        }
    }

    public String getFullCalendar(String calendarId){
        String out="";
        try{
            if(rssDocument != null){
                Element root = rssDocument.getDocumentElement();
                NodeList items = root.getElementsByTagName( "object");
                out += "[";
                for ( int i = 0; i < items.getLength(); i++ ) {
                    if (i > 0) out += ",";
                    Element thisItem = (Element)items.item(i);
                    out += itemJson( thisItem );
                }
                out += "]";
            }
            else{
                out = "[]";
            }
            return out;
        }
        catch(UnsupportedEncodingException e){
            e.printStackTrace();
            return "[]";
        }
    }

    public boolean showEvent(Calendar endDate){
        return (endDate.getTimeInMillis() > Calendar.getInstance().getTimeInMillis());
    }

}
