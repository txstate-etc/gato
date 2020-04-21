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

import javax.inject.Inject;

import javax.jcr.Node;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
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
  private GatoUtils gf;
  
  @Inject
  public FSDirectoryModel(Node content, RD definition, RenderingModel<?> parent, GatoUtils gf) {
    super(content, definition, parent);
    this.gf = gf;
  }
  
  public List<ContentMap> getPeople(List<ContentMap> list) {
    List<ContentMap> fullList = new ArrayList<ContentMap>(list);
    List<String> netids = getNetids();
    if (netids.size() == 0) return list;
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
              PropertyUtil.setProperty(n, "office", p.getOfficeLocation());
              //phone
              PropertyUtil.setProperty(n, "phone", p.getOfficePhone());
              //faculty profiles link
              if (p.getDmid().length() > 0)
                PropertyUtil.setProperty(n, "fplink", gf.getConfigProperty("fp.profile.basepath") + "/" + p.getDmid());
              //picture
              if (p.getImagePath().length() > 0 && p.getDmid().length() > 0) {
                PropertyUtil.setProperty(n, "fpimage", gf.getConfigProperty("fp.api.basepath") + "/files/photo/" +  p.getDmid() + "/" + p.getImagePath());
                PropertyUtil.setProperty(n, "fpfacedetected", p.getFaceDetected());
                if (p.getFaceAspect() > -1) {
                  PropertyUtil.setProperty(n, "fpfaceaspect", p.getFaceAspect());
                }
                if (p.getFaceDetected()) {
                  PropertyUtil.setProperty(n, "fpfaceleft", p.getFaceLeft());
                  PropertyUtil.setProperty(n, "fpfacetop", p.getFaceTop());
                  PropertyUtil.setProperty(n, "fpfacewidth", p.getFaceWidth());
                }
              }
              PropertyUtil.setProperty(n, "biography", p.getBiography());
              PropertyUtil.setProperty(n, "teachinginterests", p.getTeachingInterests());
              PropertyUtil.setProperty(n, "researchinterests", p.getResearchInterests());
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
      HttpPost httpPost = new HttpPost(gf.getConfigProperty("motion.basepath"));
      String json = "{\"query\":\"{users(filter:{netids: [%s]}){netid name {preferred legalFirst last} officePhone ldapAccount {email title}}}\"}";
      String query = String.format(json, String.join(",", quotednetids));
      httpPost.setEntity(new StringEntity(query, "UTF-8"));
      httpPost.setHeader("content-type", "application/json");
      httpPost.setHeader("authorization", "Bearer " + gf.getConfigProperty("motion.bear.token"));
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
    
    try {
      String url = constructFPUrl(netids);
      CloseableHttpClient fpClient = HttpClients.createDefault();
      HttpGet request = new HttpGet(url);
      request.setHeader("X-Secret-Key", gf.getConfigProperty("fp.api.key"));
      request.setHeader("content-type", "application/json");
      CloseableHttpResponse fpResponse = fpClient.execute(request);
      HttpEntity fpEntity = fpResponse.getEntity();
      String fpResult = EntityUtils.toString(fpEntity);
      JsonArray data = new JsonParser().parse(fpResult).getAsJsonArray();
      for (JsonElement el : data) {
        JsonObject profile = el.getAsJsonObject();
        String username = profile.getAsJsonPrimitive("username").getAsString();
        if (peoplehash.containsKey(username)) {
          FSPerson p = peoplehash.get(username);
          String dmid = profile.getAsJsonPrimitive("id").getAsString();
          p.setDmid(dmid);
          if (profile.has("office_location")) {
            p.setOfficeLocation(profile.getAsJsonPrimitive("office_location").getAsString());
          }
          if (profile.has("portrait")) {
            JsonObject portrait = profile.getAsJsonObject("portrait");
            String imageFileName = portrait.getAsJsonPrimitive("filename").getAsString();
            p.setImagePath(imageFileName);
            if (portrait.has("face")) {
              JsonObject face = portrait.getAsJsonObject("face");
              boolean detected = face.getAsJsonPrimitive("detected").getAsBoolean();
              p.setFaceDetected(detected);
              if (face.has("aspect")) {
                double aspect = face.getAsJsonPrimitive("aspect").getAsDouble();
                p.setFaceAspect(aspect);
              }
              if (face.has("left")) {
                double left = face.getAsJsonPrimitive("left").getAsDouble();
                p.setFaceLeft(left);
              }
              if (face.has("top")) {
                double top = face.getAsJsonPrimitive("top").getAsDouble();
                p.setFaceTop(top);
              }
              if (face.has("width")) {
                double width = face.getAsJsonPrimitive("width").getAsDouble();
                p.setFaceWidth(width);
              }
            }
          }
          if (profile.has("biography")) {
            p.setBiography(profile.getAsJsonPrimitive("biography").getAsString());
          }
          if (profile.has("teaching_interests")) {
            p.setTeachingInterests(profile.getAsJsonPrimitive("teaching_interests").getAsString());
          }
          if (profile.has("research_interests")) {
            p.setResearchInterests(profile.getAsJsonPrimitive("research_interests").getAsString());
          }
        }
      }
      fpClient.close();
    } catch(Exception e) {
      e.printStackTrace();
    }
    return peoplehash;
  }
  
  private String constructFPUrl(List<String> netids) {
    String url = gf.getConfigProperty("fp.api.basepath") + "/profiles?";
    for (int i=0; i<netids.size(); i++) {
      url += "netid[]=" + netids.get(i);
      if (i != netids.size() - 1) url += "&";
    }
    return url;
  }
}
