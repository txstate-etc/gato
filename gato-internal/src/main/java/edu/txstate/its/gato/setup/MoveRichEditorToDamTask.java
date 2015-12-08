package edu.txstate.its.gato.setup;

import info.magnolia.dam.app.setup.migration.MoveFCKEditorContentToDamMigrationTask;
import info.magnolia.dam.jcr.AssetNodeTypes;
import info.magnolia.link.Link;
import info.magnolia.link.LinkUtil;
import info.magnolia.link.LinkException;
import info.magnolia.repository.RepositoryConstants;
import info.magnolia.objectfactory.Components;
import info.magnolia.templating.functions.TemplatingFunctions;

import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.PropertyUtil;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.PropertyType;
import javax.jcr.Session;
import javax.jcr.query.QueryResult;

import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;
import info.magnolia.module.delta.TaskExecutionException;

import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.core.NodeImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class MoveRichEditorToDamTask extends MoveFCKEditorContentToDamMigrationTask {
  private static final Logger log = LoggerFactory.getLogger(MoveRichEditorToDamTask.class);
  protected String templateId;
  protected TemplatingFunctions cmsfn;
  protected LinkMigrationLogic lmlogic;

  public MoveRichEditorToDamTask(String templateId, String propertyName) {
    super("DAM Rich Editor Migration", "Move binary files from rich editor properties in the website tree to the DAM.",
      RepositoryConstants.WEBSITE, Arrays.asList("/"), "", propertyName);
    this.templateId = templateId;
    this.cmsfn = Components.getSingleton(TemplatingFunctions.class);
    this.lmlogic = Components.getSingleton(LinkMigrationLogic.class);
    lmlogic.setMigrationEnabled(true);
  }

  // the property name query they were using didn't work at all so I'm overriding
  // this method from the abstract class to use the template id query from
  // GatoBaseUpgradeTask
  @Override
  protected QueryResult executeQuery(String statement, Session session) {
    try {
      return session.getWorkspace().getQueryManager().
        createQuery("SELECT * FROM [nt:base] WHERE [mgnl:template] = '"+this.templateId+"'", "JCR-SQL2").
        execute();
    } catch (RepositoryException e) {
      log.error("Not able to execute the following query '{}' against the following session '{}'. Exception '{}'", Arrays.asList(statement, session.getWorkspace().getName(), e.getMessage()), e);
      return null;
    }
  }

  @Override
  protected void handleUploadReferenceForNode(Node node) throws RepositoryException {
    try {
      if (node.hasProperty(getPropertyValue())) handleTextProperty(node, node.getProperty(getPropertyValue()));
    } catch (Exception e) {
      log.warn("Not able to handle the following node '{}'", NodeUtil.getName(node), e);
    }
  }

  // in magnolia's task this crashed the upgrade when it encountered a broken link
  public final Pattern HREF_PATTERN = Pattern.compile("(href\\s*=\\s*['\"])([^'\"]+)(['\"])");
  public final Pattern SRC_PATTERN = Pattern.compile("(src\\s*=\\s*['\"])([^'\"]+)(['\"])");
  public final Pattern URL_PATTERN = Pattern.compile("(url\\(['\"]?)([^\\)]*)(['\"]?\\))");
  protected void handleTextProperty(Node node, Property property) throws LinkException, RepositoryException {
    String propString = property.getString();
    if (StringUtils.isBlank(propString)) return;
    List<Link> links = collectLinks(propString);
    for (Link link : links) {
      try {
        moveResourceNodeAndHandleLink(node, property, link);
      } catch (Exception e) {
        log.warn(e.toString(), e);
      }
    }

    propString = property.getString();
    //now look for relative links that never got converted to magnolia's {{}} style
    List<Pattern> patterns = Arrays.asList(HREF_PATTERN, SRC_PATTERN, URL_PATTERN);
    for (Pattern p : patterns) {
      StringBuffer result = new StringBuffer();
      Matcher matcher = p.matcher(propString);
      while (matcher.find()) {
        String path = matcher.group(2);
        Node damItem = null;
        if (path.startsWith("${")) {
          // these are not the links you're looking for
        } else if (LinkUtil.isInternalRelativeLink(path)) {
          // let's see if we have a path to an image
          Node page = cmsfn.page(node);
          if (page != null) {
            Path filepath = Paths.get(path);
            Path pagepath = Paths.get(page.getPath());
            damItem = lmlogic.convertWebsitePathToDamNode(
              Paths.get(pagepath.getParent().toString() +"/"+ filepath.toString())
            );
          }
        } else {
          // let's see if we have a DMS link
          damItem = lmlogic.convertUrlToDamNode(path);
        }
        if (damItem != null) path = getDamLink(damItem);

        matcher.appendReplacement(result, "$1" + Matcher.quoteReplacement(path) + "$3");
      }
      matcher.appendTail(result);
      propString = result.toString();
    }
    property.setValue(propString);
  }

  // updated this method to handle the case where two rich editors point at the
  // same file, e.g. after a page copy.
  protected void moveResourceNodeAndHandleLink(Node node, Property property, Link link) throws RepositoryException {
    if (link == null || link.getWorkspace() == null) return;
    Node damItem = null;
    String path = link.getPath();
    if (!StringUtils.isBlank(link.getPropertyName())) path += "/"+link.getPropertyName();
    if (link.getWorkspace().equals("dms")) damItem = lmlogic.convertUrlToDamNode(path);
    else damItem = lmlogic.convertWebsiteUrlToDamNode(path);

    if (damItem != null)
      changeLinkInTextContent(property, damItem.getIdentifier(), link.getUUID(), link.getPath(), link.getPropertyName());
  }

  protected void changeLinkInTextContent(Property property, String damAssetIdentifier, String originalFileUUID, String originalFileNodePath, String nodeData) throws RepositoryException {
    String text = property.getString();
    String newLinkText = Matcher.quoteReplacement(getDamLink(damSession.getNodeByIdentifier(damAssetIdentifier)));
    text = text.replaceAll(Pattern.quote("${link:{")+"([^\\}]\\}|\\}[^\\}]|[^\\}])*?"+Pattern.quote("uuid:{"+originalFileUUID+"}")+"([^\\}]\\}|\\}[^\\}]|[^\\}])*?"+Pattern.quote("nodeData:{"+nodeData+"}")+".*?"+Pattern.quote("}}")+"+", newLinkText);
    text = text.replaceAll(Pattern.quote("${link:{")+"([^\\}]\\}|\\}[^\\}]|[^\\}])*?"+Pattern.quote("handle:{"+originalFileNodePath+"}")+"([^\\}]\\}|\\}[^\\}]|[^\\}])*?"+Pattern.quote("nodeData:{"+nodeData+"}")+".*?"+Pattern.quote("}}")+"+", newLinkText);
    property.setValue(text);
  }

  protected String getDamLink(Node damNode) throws RepositoryException {
    Link newLink = new Link(damNode);
    return LinkUtil.toPattern(newLink);
  }
}
