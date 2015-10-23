package edu.txstate.its.gato;

import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.model.RenderingModelImpl;
import info.magnolia.rendering.template.RenderableDefinition;

import java.io.UnsupportedEncodingException;

import java.util.Calendar;
import java.util.List;
import java.util.ArrayList;

import javax.inject.Inject;
import javax.jcr.Node;

import org.apache.commons.lang3.StringUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

public class EventsModel<RD extends RenderableDefinition> extends RenderingModelImpl<RD> {
  private static final Logger log = LoggerFactory.getLogger(EventsModel.class);

  public static final String CALENDAR_URL = "http://etcalendar.its.txstate.edu"; //FIXME: put this in the config tree.

  private final Exception error;
  private final List<EventsItem> items;

  @Inject
  public EventsModel(Node content, RD definition, RenderingModel<?> parent) {    
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

  public Exception getError() { return error; }
  public List<EventsItem> getItems() { return items; }

  public boolean isCollapsed() {
    return "collapsedlist".equalsIgnoreCase(PropertyUtil.getString(content, "displayStyle", ""));
  }

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

  private static String constructUrl(Node content) throws UnsupportedEncodingException {
    final String calendarId = PropertyUtil.getString(content, "calendarId", "");
  
    String url = CALENDAR_URL + "/search.xml?b=de";
    
    if ( !StringUtils.isEmpty(calendarId) ) {
      String path;
      final java.util.regex.Pattern p = java.util.regex.Pattern.compile("^%2Fpublic(.*)$");
      final java.util.regex.Matcher m = p.matcher(calendarId);
      if ( m.find() ) {
        // FIXME: do we still need to do this?
        // looks like an old bedework path, needs some cleanup
        path = java.net.URLDecoder.decode(m.group(1), "UTF-8");
        path = path.toLowerCase().replaceAll("\\s+", "-").replaceAll("[^/a-z-]", "");
      } else {
        // looks like a clean path
        path = calendarId;
      }
      url += "&path="+java.net.URLEncoder.encode(path, "UTF-8");
    }
    
    final String rangeType = PropertyUtil.getString(content, "range_type", "days");

    Calendar startDate = null;
    Calendar endDate = null;

    if ("range".equals(rangeType)) {
      startDate = PropertyUtil.getDate(content, "range_from", Calendar.getInstance());
      endDate = PropertyUtil.getDate(content, "range_to");
    } else {
      startDate = Calendar.getInstance();
    }

    if (endDate == null) {
      endDate = (Calendar)startDate.clone();
      final String days = PropertyUtil.getString(content, "days", "");
      if ( "range".equals(rangeType) || StringUtils.isEmpty(days) ) {
        endDate.add( Calendar.DATE, 7 );
      } else {
        endDate.add( Calendar.DATE, Integer.parseInt( days ) );
      }
    }
    
    url = url + "&year=" + startDate.get( Calendar.YEAR );
    url = url + "&month=" + ( startDate.get( Calendar.MONTH ) + 1 );
    url = url + "&day=" + startDate.get( Calendar.DATE );
    
    url = url + "&end_year=" + endDate.get( Calendar.YEAR );
    url = url + "&end_month=" + ( endDate.get( Calendar.MONTH ) + 1 );
    url = url + "&end_day=" + endDate.get( Calendar.DATE );
          
    return url;
  }
}
