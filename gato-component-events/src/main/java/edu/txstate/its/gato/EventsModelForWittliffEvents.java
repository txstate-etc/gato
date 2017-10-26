package edu.txstate.its.gato;

import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.model.RenderingModelImpl;
import info.magnolia.rendering.template.RenderableDefinition;

import java.io.UnsupportedEncodingException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.SortedMap;
import java.util.SortedSet;
import java.util.TreeMap;
import java.util.TreeSet;

import javax.inject.Inject;
import javax.jcr.Node;

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
  protected final List<String> categories;
  protected final List<FilterMonth> months;

  @Inject
  public EventsModelForWittliffEvents(Node content, RD definition, RenderingModel<?> parent) {
    super(content, definition, parent);

    Exception error = null;
    Set<EventsItem> items = new HashSet<EventsItem>();
    this.categories = new ArrayList<String>();
    this.months = new ArrayList<FilterMonth>();
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
  public List<String> getCategories() { return categories; }
  public List<FilterMonth> getMonths() { return months; }

  protected static DateFormat monthyearformat = new SimpleDateFormat("MMMM yyyy");
  protected List<EventsItem> fetchItems(String url) {
    final List<EventsItem> items = new ArrayList<EventsItem>();
    final Document rssDocument = DomUtils.parseXml(url);
    final SortedSet<String> cats = new TreeSet<String>();

    final SortedMap<String,Boolean> monthmap = new TreeMap<String, Boolean>();
    final Map<String,String> monthnames = new HashMap<String,String>();
    Calendar nextyear = Calendar.getInstance();
    nextyear.add(Calendar.YEAR, 1);
    for (Calendar c = Calendar.getInstance(); !c.after(nextyear); c.add(Calendar.MONTH, 1)) {
      String key = EventsItem.machineMonthFormat.format(c.getTime());
      monthmap.put(key, Boolean.FALSE);
      monthnames.put(key, monthyearformat.format(c.getTime()));
    }

    if (rssDocument != null) {
      final Element root = rssDocument.getDocumentElement();
      final NodeList nodes = root.getElementsByTagName( "object" );
      for ( int i = 0; i < nodes.getLength(); i++ ) {
        EventsItem e = new EventsItem((Element)nodes.item(i));
        cats.addAll(e.getCategories());
        monthmap.put(e.getMachineMonth(), Boolean.TRUE);
        items.add(e);
      }
      categories.addAll(cats);
      while (!monthmap.get(monthmap.lastKey()).booleanValue()) {
        monthmap.remove(monthmap.lastKey());
      }
      for (String key : monthmap.keySet()) {
        months.add(new FilterMonth(key, monthnames.get(key)));
      }
    }
    return items;
  }

  protected String constructCalendarUrl(Node content) throws UnsupportedEncodingException {
    return constructUrl(content, "cal=3");
  }

  protected String constructCategoryUrl(Node content) throws UnsupportedEncodingException {
    return constructUrl(content, ""); //cat_any=25
  }

  protected String constructUrl(Node content, String params) throws UnsupportedEncodingException {
    String url = CALENDAR_URL + "/search.xml?"+params;

    //Start with the next 30 days of events
    Calendar startDate = Calendar.getInstance();
    Calendar endDate = (Calendar) startDate.clone();
    endDate.add(Calendar.MONTH, 6);

    url = url + "&year=" + startDate.get( Calendar.YEAR );
    url = url + "&month=" + ( startDate.get( Calendar.MONTH ) + 1 );
    url = url + "&day=" + startDate.get( Calendar.DATE );

    url = url + "&end_year=" + endDate.get( Calendar.YEAR );
    url = url + "&end_month=" + ( endDate.get( Calendar.MONTH ) + 1 );
    url = url + "&end_day=" + endDate.get( Calendar.DATE );
    return url;
  }

}
