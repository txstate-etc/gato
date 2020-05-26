package edu.txstate.its.gato.setup;

import info.magnolia.init.MagnoliaConfigurationProperties;
import info.magnolia.module.InstallContext;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.objectfactory.Components;
import info.magnolia.repository.RepositoryConstants;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Property;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.jcr.util.NodeVisitor;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.HttpEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.google.gson.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FilterableSearchDirectoryUpdate extends GatoBaseUpgradeTask{

  private static final Logger log = LoggerFactory.getLogger(FilterableSearchDirectoryUpdate.class);

  public FilterableSearchDirectoryUpdate() {
    super("FilterableSearchDirectoryUpdate", "Change datasource=netid to datasource=netidgroup. Move link into new links field.");
  }
  
  @Override
  protected void doExecute(InstallContext installContext) throws RepositoryException, TaskExecutionException {
    Session websiteSession = installContext.getJCRSession(RepositoryConstants.WEBSITE);
    visitByTemplate(websiteSession, "gato-area-filterable-search:components/directory", new NodeVisitor() {
      public void visit(Node n) throws RepositoryException {
        if (n.hasNode("listitems")) {
          Node listItemsNode = n.getNode("listitems");
          NodeIterator iter = listItemsNode.getNodes();
          while(iter.hasNext()) {
            Node item = iter.nextNode();
            if (item.hasProperty("datasource") && PropertyUtil.getString(item, "datasource", "").equals("netid")) {
              PropertyUtil.setProperty(item, "datasource", "netidgroup");
            }
            if (item.hasProperty("link")) {
              String src = PropertyUtil.getString(item, "link", "");
              String linkText = "Custom Link";
              if (item.hasProperty("datasource")) {
                if (PropertyUtil.getString(item, "datasource", "").equals("manual")) {
                  String name = (item.hasProperty("prefix") ? PropertyUtil.getString(item, "prefix", "") : "");
                  name += " " + (item.hasProperty("firstname") ? PropertyUtil.getString(item, "firstname", "") : "");
                  name += " " + (item.hasProperty("lastname") ? PropertyUtil.getString(item, "lastname", "") : "");
                  if (name.trim().length() > 0)
                    linkText = "More about " + name.trim();
                }
              }
              if (src.length() > 0) {
                Node links = NodeUtil.createPath(item, "links", NodeTypes.ContentNode.NAME);
                Node newLink = NodeUtil.createPath(links, "0", NodeTypes.ContentNode.NAME);
                PropertyUtil.setProperty(newLink, "link", src);
                PropertyUtil.setProperty(newLink, "text", linkText);
              }
            }
          }
        }
      }
    });
  }
}