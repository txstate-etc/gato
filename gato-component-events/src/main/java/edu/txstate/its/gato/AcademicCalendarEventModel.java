package edu.txstate.its.gato;

import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.template.RenderableDefinition;

import java.io.UnsupportedEncodingException;
import java.net.URL;
import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.RepositoryException;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Comparator;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

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

  protected String getCalendarId() {
    try {
      Node page = NodeUtil.getNearestAncestorOfType(content, "mgnl:page");
      String id =  PropertyUtil.getString(page, "calendarId");
      return (null == id) ? defaultCalendarId : id;
    } catch(Exception e) {
      e.printStackTrace();
    }
    return defaultCalendarId;
  }

  protected List<EventItem> initList() throws UnsupportedEncodingException {
    final List<EventItem> items = new ArrayList<EventItem>();

    try {
      final String url = constructUrl();
      log.debug("Using URL: {}", url);
      String firstSemesterShown = "";
      String lastSemesterShown = "";
      try {
        Node page = NodeUtil.getNearestAncestorOfType(content, "mgnl:page");
        firstSemesterShown = PropertyUtil.getString(page, "firstSemesterShown", "");
        lastSemesterShown = PropertyUtil.getString(page, "lastSemesterShown", "");
      } catch(Exception e) {
        e.printStackTrace();
      }

      String json = IOUtils.toString(new URL(url).openStream());
      JsonArray cal = new JsonParser().parse(json).getAsJsonArray();

      for (JsonElement e : cal) {
        TrumbaEventItem t = new TrumbaEventItem((JsonObject) e);
        String applicableTerm = t.getCustomProperty("Applicable Term");
        if (applicableTerm.length() > 0) {
          if (firstSemesterShown.length() > 0 && compareSemester(applicableTerm, firstSemesterShown) < 0) {
            continue;
          }
          if (lastSemesterShown.length() > 0 && compareSemester(applicableTerm, lastSemesterShown) > 0) {
            continue;
          }
          items.add(t);
          if (t.getCustomProperty("Ending Title").length() > 0) {
            String jsonString = e.toString();
            JsonObject endObj = new JsonParser().parse(jsonString).getAsJsonObject();
            endObj.addProperty("title", t.getCustomProperty("Ending Title"));
            endObj.addProperty("eventId", t.getRecurrenceId() + "e");
            endObj.addProperty("startDateTime", t.getPropertyString("endDateTime"));
            endObj.addProperty("startTimeZoneOffset", t.getPropertyString("endTimeZoneOffset"));
            items.add(new TrumbaEventItem(endObj));
          }
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
    String firstSemesterShown = "";
    String lastSemesterShown = "";
    try {
      Node page = NodeUtil.getNearestAncestorOfType(content, "mgnl:page");
      firstSemesterShown = PropertyUtil.getString(page, "firstSemesterShown", "");
      lastSemesterShown = PropertyUtil.getString(page, "lastSemesterShown", "");
    } catch (RepositoryException e) {
      e.printStackTrace();
    }

    Calendar startDate = Calendar.getInstance();
    Calendar endDate = (Calendar) startDate.clone();

    if (firstSemesterShown.length() > 0) {
      String[] semester = firstSemesterShown.split(" ");
      if (semester[0].equals("Fall")) {
        // fall semester starts in August, get dates from March to make sure we get the registration deadlines
        startDate.set(Integer.parseInt(semester[1]), Calendar.MARCH, 1);
      } else if (semester[0].equals("Summer")) {
        // summer semester starts in May, get dates from January
        startDate.set(Integer.parseInt(semester[1]), Calendar.JANUARY, 1);
      } else {
        // spring semester starts in January, get dates from October
        startDate.set(Integer.parseInt(semester[1]) - 1, Calendar.OCTOBER, 1);
      }
    } else {
      startDate.add(Calendar.MONTH, -12);
    }

    if (lastSemesterShown.length() > 0) {
      String[] semester = lastSemesterShown.split(" ");
      if (semester[0].equals("Fall")) {
        endDate.set(Integer.parseInt(semester[1]), Calendar.DECEMBER, 31);
      } else if (semester[0].equals("Summer")) {
        endDate.set(Integer.parseInt(semester[1]), Calendar.AUGUST, 31);
      } else {
        endDate.set(Integer.parseInt(semester[1]), Calendar.MAY, 31);
      }
    } else {
      endDate.add(Calendar.MONTH, 12);
    }
    
    url = url + "?startdate=" + trumbaformat.format(startDate.getTime());
    url = url + "&enddate=" + trumbaformat.format(endDate.getTime());
    System.out.println(url);
    return url;
  }

  public String dateSuffix(Date date) {
    Calendar day = Calendar.getInstance();
    day.setTime(date);
    int dayOfMonth = day.get(Calendar.DAY_OF_MONTH);
    if (dayOfMonth == 11 || dayOfMonth == 12 || dayOfMonth == 13) {
      return "th";
    }
    switch(dayOfMonth % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }

  public int compareSemester(String a, String b) {
    String[] semesterA = a.split(" ");
    String[] semesterB = b.split(" ");
    if (semesterA[1].compareTo(semesterB[1]) < 0) {
      return -1;
    } else if (semesterA[1].compareTo(semesterB[1]) > 0) {
      return 1;
    } else {
      String seasonA = semesterA[0];
      String seasonB = semesterB[0];
      if (seasonA.equals(seasonB)) return 0;
      if (seasonA.equals("Spring")) {
        return -1;
      } else if(seasonA.equals("Summer")) {
        if (seasonB.equals("Spring")) {
          return 1;
        } else if (seasonB.equals("Fall")) {
          return -1;
        }
      } else if (seasonA.equals("Fall")) {
        return 1;
      }
    }
    return 0;
  }

  public String guessCurrentSemester() {
    System.out.println("Guessing current Semester");
    Calendar today = Calendar.getInstance();
    int month = today.get(Calendar.MONTH);
    int year = today.get(Calendar.YEAR);
    String season;
    switch(month) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
        season = "Spring";
        break;
      case 5:
      case 6:
        season = "Summer";
        break;
      case 7: 
      case 8:
      case 9:
      case 10:
      case 11:
        season = "Fall";
        break;
      default:
        season = "Fall";
    }
    return season + " " + year;
  }
}