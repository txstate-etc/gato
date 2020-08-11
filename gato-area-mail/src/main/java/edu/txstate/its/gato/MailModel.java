package edu.txstate.its.gato;

import info.magnolia.context.SystemContext;
import info.magnolia.init.MagnoliaConfigurationProperties;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.objectfactory.Components;
import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.model.RenderingModelImpl;
import info.magnolia.rendering.template.configured.ConfiguredTemplateDefinition;
import info.magnolia.repository.RepositoryConstants;
import info.magnolia.templating.functions.TemplatingFunctions;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.HashMap;

public class MailModel<RD extends ConfiguredTemplateDefinition> extends RenderingModelImpl<ConfiguredTemplateDefinition> {

  private MagnoliaConfigurationProperties mcp = Components.getSingleton(MagnoliaConfigurationProperties.class);
  private TemplatingFunctions cmsfn = Components.getSingleton(TemplatingFunctions.class);
  private SystemContext systemcontext = Components.getSingleton(SystemContext.class);
  private HashMap<String, String> titleMap = new HashMap<String, String>();
  private HashMap<String, Integer> titleCounts = new HashMap<String, Integer>();
  private String dataToolLink = "";

  public MailModel(Node content, ConfiguredTemplateDefinition definition, RenderingModel<?> parent) throws PathNotFoundException, RepositoryException, NoSuchAlgorithmException, UnsupportedEncodingException {
    super(content, definition, parent);

    for (Node component : NodeUtil.getNodes(content, NodeTypes.Component.NAME)) {
      String title = safeComponentTitle(component);
      titleMap.put(component.getIdentifier(), title);

      if (component.getProperty("mgnl:template").getString().equals("gato-area-mail:components/formconditionalv2")) {
        if (component.hasNode("questionlist")) {
          Node conditions = component.getNode("questionlist");
          for (Node condition : NodeUtil.getNodes(conditions)) {
            String conditionTitle = safeComponentTitle(condition);
            titleMap.put(condition.getIdentifier(), conditionTitle);
          }
        }
        if (component.hasNode("questions")) {
          Node questions = component.getNode("questions");
          for (Node question : NodeUtil.getNodes(questions)) {
            String questionTitle = safeComponentTitle(question);
            titleMap.put(question.getIdentifier(), questionTitle);
          }
        }
      }
    }

    // grab the link to the form data tool
  	Date now = new Date();
		String unixTime = String.format("%Ts", now);

		Node thisPage = cmsfn.page(content);
  	String uuid = thisPage.getIdentifier();

		String stringToEncode = "gato:" + unixTime + ":" + uuid;

    Session cs = systemcontext.getJCRSession(RepositoryConstants.CONFIG);
    String secretKey = "";
    if (cs.nodeExists("/modules/gato-internal/settings")) {
      Node settings = cs.getNode("/modules/gato-internal/settings");
      secretKey = PropertyUtil.getString(settings, "secretKey", "");
		}

		String encodedString = AeSimpleSHA1.SHA1( secretKey + ":" + stringToEncode );
		dataToolLink = mcp.getProperty("gato.formemailer.server")+"/formemailer/login.pl?method=sig&amp;data="+URLEncoder.encode( stringToEncode )+"&amp;sig="+URLEncoder.encode( encodedString );
  }

  private String safeComponentTitle(Node component) throws RepositoryException, PathNotFoundException {
    String title = "unnamed";
    if (component.hasProperty("title")) {
      title = component.getProperty("title").getString();
    }
    title = cleanTitle(title);
    if (!titleCounts.containsKey(title)) {
      titleCounts.put(title, 1);
    } else {
      int count = titleCounts.get(title);
      titleCounts.put(title, count + 1);
      title = title + "-" + count;
    }
    return title;
  }

  private String cleanTitle(String title) {
    title = title.replaceAll("<([A-Za-z0-9=:/ \"]*)>", "");
    title = title.replaceAll(" ", "-" );
    title = title.replaceAll("^-|-$|[^A-Za-z0-9-]", "");
    title = title.replaceAll("^([0-9])", "num-$1" ); // must start with a letter
    return title.toLowerCase();
  }

  public String getSafeTitle(String nodeId) {
    return titleMap.get(nodeId);
  }

  public String getDataToolLink() {
    return dataToolLink;
	}

}
