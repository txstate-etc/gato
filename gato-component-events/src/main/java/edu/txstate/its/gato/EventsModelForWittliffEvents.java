package edu.txstate.its.gato;

import javax.jcr.Node;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.template.RenderableDefinition;

import java.io.UnsupportedEncodingException;

import java.util.Calendar;
import java.util.List;
import java.util.ArrayList;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

public class EventsModelForWittliffEvents<RD extends RenderableDefinition> extends EventsModel<RD> {
    private static final Logger log = LoggerFactory.getLogger(EventsModelForWittliffEvents.class);

    private final Exception error;
    private final List<EventsItem> items;

    @Inject
    public EventsModelForWittliffEvents(Node content, RD definition, RenderingModel<?> parent) {    
        super(content, definition, parent);
        
        Exception error = null;
        List<EventsItem> items = null;
        try {
          items = initList(content);
        } catch (Exception e) {
          log.error("Failed to fetch RSS feed.", e);
          error = e;
        }

        this.items = items;
        this.error = error;
    }

    //it would be nice if some of these private things were protected
    private static List<EventsItem> initList(Node content) throws UnsupportedEncodingException {
    final List<EventsItem> items = new ArrayList<EventsItem>();

    final String url = constructUrl(content);
    log.debug("Using URL: {}", url);

    final Document rssDocument = DomUtils.parseXml(url);
    if (rssDocument != null) {
      final Element root = rssDocument.getDocumentElement();
      final NodeList nodes = root.getElementsByTagName( "object" );
      for ( int i = 0; i < nodes.getLength(); i++ ) {
        items.add(new EventsItem((Element)nodes.item(i)));
      }
    }

    return items;
  }

    public Exception getError() { return error; }
    public List<EventsItem> getItems() { return items; }

    private static String constructUrl(Node content) throws UnsupportedEncodingException {
        //Start with the next 30 days of events
        Calendar startDate = Calendar.getInstance();
        Calendar endDate = (Calendar) startDate.clone();
        endDate.add(Calendar.DATE, 30);

        //category temporarily set to Entertainment
        String url = "http://etcalendar.its.txstate.edu/search.xml?b=de&cat_any=18";
        url = url + "&year=" + startDate.get( Calendar.YEAR );
        url = url + "&month=" + ( startDate.get( Calendar.MONTH ) + 1 );
        url = url + "&day=" + startDate.get( Calendar.DATE );
        
        url = url + "&end_year=" + endDate.get( Calendar.YEAR );
        url = url + "&end_month=" + ( endDate.get( Calendar.MONTH ) + 1 );
        url = url + "&end_day=" + endDate.get( Calendar.DATE );
        return url;
    }


}