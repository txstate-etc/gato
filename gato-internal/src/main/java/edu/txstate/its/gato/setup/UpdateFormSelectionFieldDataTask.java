package edu.txstate.its.gato.setup;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;

import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;

import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UpdateFormSelectionFieldDataTask extends GatoBaseUpgradeTask {
  private static final Logger log = LoggerFactory.getLogger(UpdateFormSelectionFieldDataTask.class);

  public final Pattern OPTION_PROPERTY_NAME_PATTERN = Pattern.compile("\\d+");

  public UpdateFormSelectionFieldDataTask() {
    super("Update Form Selection Field Data", "Update field options to accomodate a help text property for each option");
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException {
    Session s=ctx.getJCRSession(RepositoryConstants.WEBSITE);

    visitByTemplate(s,"gato-area-mail:components/formselection", n-> {
      if (n.hasNode("options")) {
        Node options = n.getNode("options");
        PropertyIterator iter = options.getProperties();
        while (iter.hasNext()){
          Property p = iter.nextProperty();
          String propName = p.getName();
          if (OPTION_PROPERTY_NAME_PATTERN.matcher(propName).matches()) {
            Node option = NodeUtil.createPath(options, propName, NodeTypes.ContentNode.NAME);
            option.setProperty("answer", p.getValue());
            p.remove();
          }
        }
      }
    });
  }
}