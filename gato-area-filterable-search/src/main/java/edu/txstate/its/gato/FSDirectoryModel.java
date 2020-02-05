package edu.txstate.its.gato;

import info.magnolia.init.MagnoliaConfigurationProperties;
import info.magnolia.jcr.util.ContentMap;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.objectfactory.Components;
import info.magnolia.rendering.template.RenderableDefinition;
import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.model.RenderingModelImpl;

import javax.jcr.Node;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.HttpEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.*;

public class FSDirectoryModel<RD extends RenderableDefinition> extends RenderingModelImpl<RD> {

  private static final Logger log = LoggerFactory.getLogger(FSDirectoryModel.class);
  
  public FSDirectoryModel(Node content, RD definition, RenderingModel<?> parent) {
    super(content, definition, parent);
  }
  
  public List<ContentMap> getPeople(List<ContentMap> list) {
    List<ContentMap> fullList = new ArrayList<ContentMap>(list);
    List<String> netids = getNetids();
    Hashtable<String, FSPerson> peoplehash = initPeopleHash(netids);
    try {
      for (ContentMap c : fullList) {
        Node n = c.getJCRNode();
        String datasource = PropertyUtil.getString(n, "datasource", "");
        if (datasource.equals("manual")) continue;
        else if (datasource.equals("netid")) {
          String netid = PropertyUtil.getString(n, "netid", "");
          if (netid.length() > 0) {
            FSPerson p = (FSPerson) peoplehash.get(netid);
            if (null != p) {
              //preferred name
              PropertyUtil.setProperty(n,"preferredname",p.getPreferredName());
              //first name
              PropertyUtil.setProperty(n,"firstname",p.getFirstName());
              //last name
              PropertyUtil.setProperty(n,"lastname",p.getLastName());
              //position
              PropertyUtil.setProperty(n, "position", p.getPosition());
              //email
              PropertyUtil.setProperty(n, "email", p.getEmail());
              //office
              //phone
              PropertyUtil.setProperty(n, "phone", p.getOfficePhone());
              //picture
              //faculty profiles link
            }
            else {
              //user is not in motion. Invalid?
            }
          }
          else {
            //mark it as invalid
          }
        }
      }
    } catch(Exception e) {
      e.printStackTrace();
    }
    
    return fullList;
  }
  
  protected List<String> getNetids() {
    List<String> results = new ArrayList<String>();
    try {
      if (content.hasNode("listitems")) {
        Node listItemsNode = content.getNode("listitems");
        Iterable<Node> listitems = NodeUtil.getNodes(listItemsNode, NodeTypes.Component.NAME);
        for (Node item : listitems) {
          String dataSource = PropertyUtil.getString(item, "datasource", "");
          if (dataSource.equals("netid")) {
            String netid = PropertyUtil.getString(item, "netid", "");
            if (netid.length() > 0) {
              results.add(netid);
            }
          }
        }
      }
    } catch(Exception e) {
      e.printStackTrace();
    }
    return results;
  }
  
  protected Hashtable<String, FSPerson> initPeopleHash(List<String> netids) {
    Hashtable<String, FSPerson> peoplehash = new Hashtable<String,FSPerson>();
    String[] quotednetids = new String[netids.size()];
    for (int i=0; i<netids.size(); i++) {
      quotednetids[i] = "\\\"" + netids.get(i) + "\\\"";
    }
    try {
      CloseableHttpClient client = HttpClients.createDefault();
      HttpPost httpPost = new HttpPost(baseUrl());
      String json = "{\"query\":\"{users(filter:{netids: [%s]}){netid name {preferred legalFirst last} officePhone ldapAccount {email title}}}\"}";
      String query = String.format(json, String.join(",", quotednetids));
      httpPost.setEntity(new StringEntity(query, "UTF-8"));
      httpPost.setHeader("content-type", "application/json");
      httpPost.setHeader("authorization", "Bearer " + bearerToken());
      CloseableHttpResponse response = client.execute(httpPost);
      HttpEntity entity = response.getEntity();
      String result = EntityUtils.toString(entity);
      JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
      JsonObject data = obj.getAsJsonObject("data");
      JsonArray arr = data.getAsJsonArray("users");
      for (JsonElement elem : arr) {
        FSPerson p = new FSPerson((JsonObject) elem);
        peoplehash.put(p.getNetId(), p);
      }
      client.close();
    } catch(Exception e) {
      e.printStackTrace();
    }
    return peoplehash;
  }
  
  protected String baseUrl() {
    MagnoliaConfigurationProperties mcp = Components.getComponent(MagnoliaConfigurationProperties.class);
    return mcp.getProperty("motion.basepath");
  }
  
  protected String bearerToken() {
    MagnoliaConfigurationProperties mcp = Components.getComponent(MagnoliaConfigurationProperties.class);
    return mcp.getProperty("motion.bear.token");
  }
  
}
