package edu.txstate.its.gato;

import javax.jcr.Node;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.model.RenderingModelImpl;
import info.magnolia.rendering.template.RenderableDefinition;

import java.io.UnsupportedEncodingException;

import java.util.Calendar;
import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

public class EventsModelForWittliffEvents<RD extends RenderableDefinition> extends RenderingModelImpl<RD> {
  private static final Logger log = LoggerFactory.getLogger(EventsModelForWittliffEvents.class);

  public static final String CALENDAR_URL = "http://etcalendar.its.txstate.edu"; //FIXME: put this in the config tree.
  private final Exception error;
  private final List<EventsItem> items;

  @Inject
  public EventsModelForWittliffEvents(Node content, RD definition, RenderingModel<?> parent) {
    super(content, definition, parent);

    Exception error = null;
    Set<EventsItem> items = new HashSet<EventsItem>();
    try {
      //items.addAll(fetchItems(constructCalendarUrl(content)));
      items.addAll(fetchItems(constructCategoryUrl(content)));
    } catch (Exception e) {
      log.error("Failed to fetch RSS feed.", e);
      error = e;
    }

    this.items = new ArrayList<EventsItem>(items);
    this.items.sort((EventsItem a, EventsItem b) -> a.getStartDate().compareTo(b.getStartDate()));
    this.error = error;
  }

  public Exception getError() { return error; }
  public List<EventsItem> getItems() { return items; }
  public boolean isCollapsed() {
    return "collapsedlist".equalsIgnoreCase(PropertyUtil.getString(content, "displayStyle", ""));
  }

  protected static List<EventsItem> fetchItems(String url) {
    final List<EventsItem> items = new ArrayList<EventsItem>();
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

  protected static String constructCalendarUrl(Node content) throws UnsupportedEncodingException {
    return constructUrl(content, "cal=3");
  }

  protected static String constructCategoryUrl(Node content) throws UnsupportedEncodingException {
    return constructUrl(content, "cat_any=25");
  }

  protected static String constructUrl(Node content, String params) throws UnsupportedEncodingException {
    String url = CALENDAR_URL + "/search.xml?"+params;

    //Start with the next 30 days of events
    Calendar startDate = Calendar.getInstance();
    Calendar endDate = (Calendar) startDate.clone();
    endDate.add(Calendar.DATE, 30);

    url = url + "&year=" + startDate.get( Calendar.YEAR );
    url = url + "&month=" + ( startDate.get( Calendar.MONTH ) + 1 );
    url = url + "&day=" + startDate.get( Calendar.DATE );

    url = url + "&end_year=" + endDate.get( Calendar.YEAR );
    url = url + "&end_month=" + ( endDate.get( Calendar.MONTH ) + 1 );
    url = url + "&end_day=" + endDate.get( Calendar.DATE );
    return url;
  }

}
