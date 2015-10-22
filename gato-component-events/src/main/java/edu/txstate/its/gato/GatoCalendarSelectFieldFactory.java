package edu.txstate.its.gato;

import info.magnolia.ui.form.field.definition.SelectFieldOptionDefinition;
import info.magnolia.ui.form.field.factory.SelectFieldFactory;

import com.vaadin.data.Item;

import java.util.List;
import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;

public class GatoCalendarSelectFieldFactory extends SelectFieldFactory<GatoCalendarSelectFieldDefinition> {
  private static final Logger log = LoggerFactory.getLogger(GatoCalendarSelectFieldFactory.class);
  
  public GatoCalendarSelectFieldFactory(GatoCalendarSelectFieldDefinition definition, Item relatedFieldItem) {
      super(definition, relatedFieldItem);
  }

  @Override
  public List<SelectFieldOptionDefinition> getSelectFieldOptionDefinition() {
    List<SelectFieldOptionDefinition> options = new ArrayList<SelectFieldOptionDefinition>();

    Document xmlDocument = null;
    try {
      xmlDocument = DomUtils.parseXml(EventsModel.CALENDAR_URL  + "/calendars.xml");
    } catch (Exception e) {
      log.error("Failed to parse xml from calendar.", e);
      // xmlDocument stays null
    }
    
    if (xmlDocument != null) {
      addCalendars(xmlDocument.getDocumentElement(), "", options);
    }

    return options;
  }

  private static void addCalendars(Element element, String prefix, List<SelectFieldOptionDefinition> options) {
    NodeList folders = DomUtils.getChildNode(element, "folders").getChildNodes();
    addCalendars(folders, prefix, options, true);
    
    NodeList calendars = DomUtils.getChildNode(element, "calendars").getChildNodes();
    addCalendars(calendars, prefix, options, false);
  }

  private static void addCalendars(NodeList nodes, String prefix, List<SelectFieldOptionDefinition> options, boolean folders) {

    for (int i = 0; i < nodes.getLength(); i++) {
      Node item = (Node)nodes.item(i);
      if (item.getNodeType() != Node.ELEMENT_NODE) continue;
      Element elem = (Element)item;
      options.add(createOption(elem, prefix));
      if (folders) {
        addCalendars(elem, prefix+"-", options);
      }
    }
  }

  private static SelectFieldOptionDefinition createOption(Element elem, String prefix) {
    String calendarId = DomUtils.getTextValue(elem, "path");
    String calendarName = prefix + " " + DomUtils.getTextValue(elem, "longname");

    SelectFieldOptionDefinition option = new SelectFieldOptionDefinition();
    option.setName(calendarId);
    option.setValue(calendarId);
    option.setLabel(calendarName);
    
    return option;
  }
}
