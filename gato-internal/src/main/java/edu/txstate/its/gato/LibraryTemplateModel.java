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



public class LibraryTemplateModel<RD extends RenderableDefinition> extends RenderingModelImpl<RD> {

    public static final String CALENDAR_URL = "http://etcalendar.its.txstate.edu";
    DateFormat inputFormatTimed = new SimpleDateFormat( "yyyy-MM-dd'T'HH:mm:ss" );
    DateFormat inputFormatUntimed = new SimpleDateFormat( "yyyyMMdd" );

    @Inject
    public LibraryTemplateModel(Node content, RD definition, RenderingModel<?> parent) {    
        super(content, definition, parent);
    }

    public String itemHtml( Element item ) throws UnsupportedEncodingException {
        String title = getTitle( item ).trim();

        Date startDate = getDate( item, "starttime" );
        Date endDate = getDate( item, "endtime" );
        
        String itemHtml = "";

        itemHtml += "<div class=\"hours\">";
        itemHtml += "<h5>";
        itemHtml += "<span class=\"summary\">" + title + "</span>";
        itemHtml += "</h5>";
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
            String url = constructUrl(isMobile);
            System.out.println("<!-- USING URL : "+ url + "-->");

            Document rssDocument = DomUtils.parseXml( url );
            if(rssDocument != null){
                Element root = rssDocument.getDocumentElement();
                NodeList items = root.getElementsByTagName( "object");
                if(isMobile){
                    out = mobileHoursHtml(items);
                }
                else{
                    for ( int i = 0; i < items.getLength(); i++ ) {
                        Element thisItem = (Element)items.item(i);
                        out += itemHtml( thisItem );
                    }
                }
                if (items.getLength() == 0) out = "No Results.";
                
            }
            else{
                out = "There was an error retrieving events.";
            }
            return out;
        }
        catch(UnsupportedEncodingException e){
            e.printStackTrace();
            return "There was an error retrieving events.";
        }
    }

    public boolean showEvent(Calendar endDate){
        return (endDate.getTimeInMillis() > Calendar.getInstance().getTimeInMillis());
    }

}