package edu.txstate.its.gato.apputil; 

import info.magnolia.ui.vaadin.integration.contentconnector.JcrContentConnectorDefinition;
import info.magnolia.ui.workbench.tree.HierarchicalJcrContainer;
import info.magnolia.ui.workbench.container.OrderBy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GatoHierarchicalJcrContainer extends HierarchicalJcrContainer {
  protected static final String ORDER_REGEX = String.format("^([^ ]+)(%s|%s)?$", ASCENDING_KEYWORD, DESCENDING_KEYWORD);

  protected Pattern orderPattern;

  public GatoHierarchicalJcrContainer(JcrContentConnectorDefinition definition) {
    super(definition);
    orderPattern = Pattern.compile(ORDER_REGEX);
  }
  
  @Override
  protected OrderBy getDefaultOrderBy(final String property) {
    Matcher m = orderPattern.matcher(property);
    if (m.matches()) {
      return new OrderBy(m.group(1), !DESCENDING_KEYWORD.equals(m.group(2)));      
    }

    return super.getDefaultOrderBy(property);
  }

  @Override
  protected String constructJCRQuery(final boolean considerSorting) {
    String ret = super.constructJCRQuery(considerSorting);

    // replace 't.[property]' with 'lower(t.[property])' so sorting is
    // case-insensitive
    ret = ret.replaceAll("t\\.\\[([^\\]]+)\\]", "lower(t.[$1])");

    return ret;
  }
}
