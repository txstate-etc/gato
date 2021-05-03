package edu.txstate.its.gato;

import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.template.RenderableDefinition;

import java.io.UnsupportedEncodingException;
import java.net.URL;
import javax.inject.Inject;
import javax.jcr.Node;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Comparator;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.SortedSet;
import java.util.TreeSet;

import com.google.gson.*;
import org.apache.commons.io.IOUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AcademicCalendarEventModel extends TrumbaEventModel {
  private static final Logger log = LoggerFactory.getLogger(AcademicCalendarEventModel.class);

  @Inject
  public AcademicCalendarEventModel(Node content, RenderableDefinition definition, RenderingModel parent) {
    super(content, definition, parent);
  }

  protected List<EventItem> initList() throws UnsupportedEncodingException {
    final List<EventItem> items = new ArrayList<EventItem>();

    try {
      final String url = constructUrl();
      log.debug("Using URL: {}", url);

      String json = IOUtils.toString(new URL(url).openStream());
      JsonArray cal = new JsonParser().parse(json).getAsJsonArray();

      for (JsonElement e : cal) {
        TrumbaEventItem t = new TrumbaEventItem((JsonObject) e);
        items.add(t);
        if (t.getCustomProperty("Ending Title").length() > 0) {
          String jsonString = e.toString();
          JsonObject endObj = new JsonParser().parse(jsonString).getAsJsonObject();
          endObj.addProperty("title", t.getCustomProperty("Ending Title"));
          endObj.addProperty("eventId", t.getRecurrenceId() + "e");
          endObj.addProperty("startDateTime", t.getPropertyString("endDateTime"));
          items.add(new TrumbaEventItem(endObj));
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    Collections.sort(items, new Comparator<EventItem>() {
      @Override
      public int compare(EventItem a, EventItem b) {
        Date startA = a.getStartDate();
        Date startB = b.getStartDate();
        return startA.compareTo(startB);
      }
    });
    return items;
  }

  protected String constructUrl() throws UnsupportedEncodingException {
    String url = baseUrl();

    Calendar startDate = Calendar.getInstance();
    Calendar endDate = (Calendar) startDate.clone();
    startDate.add(Calendar.MONTH, -12);
    endDate.add(Calendar.MONTH, 12);

    url = url + "?startdate=" + trumbaformat.format(startDate.getTime());
    url = url + "&enddate=" + trumbaformat.format(endDate.getTime());
    return url;
  }
}