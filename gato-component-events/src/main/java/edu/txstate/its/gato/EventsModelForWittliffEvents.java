package edu.txstate.its.gato;

import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.template.RenderableDefinition;

import java.io.UnsupportedEncodingException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.SortedMap;
import java.util.SortedSet;
import java.util.TreeMap;
import java.util.TreeSet;

import javax.inject.Inject;
import javax.jcr.Node;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class EventsModelForWittliffEvents extends TrumbaEventModel {
  private static final Logger log = LoggerFactory.getLogger(EventsModelForWittliffEvents.class);

  protected final List<String> categories;
  protected final List<FilterMonth> months;

  protected static DateFormat monthyeardisplay = new SimpleDateFormat("MMM ''yy");
  protected String defaultCalendarId = "1420563";

  @Inject
  public EventsModelForWittliffEvents(Node content, RenderableDefinition definition, RenderingModel parent) {
    super(content, definition, parent);

    final SortedSet<String> cats = new TreeSet<String>();

    final SortedMap<String,Long> monthmap = new TreeMap<String, Long>();
    final Map<String,String> monthnames = new HashMap<String,String>();
    Calendar nextyear = Calendar.getInstance();
    nextyear.add(Calendar.YEAR, 1);
    for (Calendar c = Calendar.getInstance(); !c.after(nextyear); c.add(Calendar.MONTH, 1)) {
      String key = AbstractEventItem.machineMonthFormat.format(c.getTime());
      monthmap.put(key, new Long(0));
      monthnames.put(key, monthyeardisplay.format(c.getTime()));
    }

    for (EventItem e : (List<EventItem>)getItems()) {
      cats.addAll(e.getCategories());
      String monthkey = e.getMachineMonth();
      Long monthcount = new Long(0);
      if (monthmap.containsKey(monthkey)) monthcount = monthmap.get(monthkey)+1;
      monthmap.put(monthkey, monthcount);
    }
    this.categories = new ArrayList<String>();
    this.categories.addAll(cats);
    while (monthmap.size() > 0 && monthmap.get(monthmap.lastKey()).longValue() == 0) {
      monthmap.remove(monthmap.lastKey());
    }
    this.months = new ArrayList<FilterMonth>();
    for (String key : monthmap.keySet()) {
      this.months.add(new FilterMonth(key, monthnames.get(key), monthmap.get(key).longValue()));
    }
  }

  public List<String> getCategories() { return categories; }
  public List<FilterMonth> getMonths() { return months; }

  protected String constructUrl() throws UnsupportedEncodingException {
    String url = baseUrl();

    Calendar startDate = Calendar.getInstance();
    Calendar endDate = (Calendar) startDate.clone();
    endDate.add(Calendar.MONTH, 12);

    url = url + "?startdate=" + trumbaformat.format(startDate.getTime());
    url = url + "&enddate=" + trumbaformat.format(endDate.getTime());
    return url;
  }
}
