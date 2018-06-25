package edu.txstate.its.gato;

import info.magnolia.init.MagnoliaConfigurationProperties;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.objectfactory.Components;
import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.model.RenderingModelImpl;
import info.magnolia.rendering.template.RenderableDefinition;

import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;

import javax.inject.Inject;
import javax.jcr.Node;

import com.google.gson.*;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TrumbaEventModel<RD extends RenderableDefinition> extends RenderingModelImpl<RD> {
  private static final Logger log = LoggerFactory.getLogger(TrumbaEventModel.class);

  protected static final DateFormat trumbaformat = new SimpleDateFormat("yyyyMMdd");

  protected Exception error;
  protected List<EventItem> items;

  @Inject
  public TrumbaEventModel(Node content, RD definition, RenderingModel<?> parent) {
    super(content, definition, parent);
    try {
      this.items = initList(content);
    } catch (Exception e) {
      log.error("Failed to fetch JSON feed.", e);
      this.error = e;
    }
  }

  public Exception getError() { return error; }
  public List<EventItem> getItems() { return items; }

  public boolean isCollapsed() {
    return "collapsedlist".equalsIgnoreCase(PropertyUtil.getString(content, "displayStyle", ""));
  }

  protected static List<EventItem> initList(Node content) throws UnsupportedEncodingException {
    final List<EventItem> items = new ArrayList<EventItem>();

    try {
      final String url = constructUrl(content);
      log.debug("Using URL: {}", url);

      String json = IOUtils.toString(new URL(url).openStream());
      JsonArray cal = new JsonParser().parse(json).getAsJsonArray();

      for (JsonElement e : cal) {
        items.add(new TrumbaEventItem((JsonObject) e));
      }
    } catch (Exception e) {
      e.printStackTrace();
    }

    return items;
  }

  protected static String baseUrl(Node content, String calendarId) {
    MagnoliaConfigurationProperties mcp = Components.getComponent(MagnoliaConfigurationProperties.class);
    return mcp.getProperty("trumba.basepath")+"/calendars/calendar."+calendarId+".json";
  }

  protected static String constructUrl(Node content) throws UnsupportedEncodingException {
    final String calendarId = PropertyUtil.getString(content, "calendarId", "1400280");
    String url = baseUrl(content, calendarId);

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

    url = url + "?startdate=" + trumbaformat.format(startDate.getTime());
    url = url + "&enddate=" + trumbaformat.format(endDate.getTime());

    return url;
  }
}
