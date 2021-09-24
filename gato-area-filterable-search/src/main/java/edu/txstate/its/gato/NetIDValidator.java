package edu.txstate.its.gato;

import com.google.gson.*;

import com.vaadin.v7.data.Item;
import com.vaadin.v7.data.validator.AbstractStringValidator;

import java.util.regex.Pattern;
import java.util.regex.Matcher;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.HttpEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class NetIDValidator extends AbstractStringValidator {
  private static final Logger log = LoggerFactory.getLogger(NetIDValidator.class);
  protected static final Pattern NETID_PATTERN = Pattern.compile("^\\s*([a-z]{2}\\d{2,5}|[a-z]{3}\\d+|[a-z]_[a-z]\\d+)\\s*$", Pattern.CASE_INSENSITIVE);
  private Item item;
  private GatoUtils gf;

  public NetIDValidator(Item item, String errorMessage, GatoUtils gf) {
    super(errorMessage);
    this.item = item;
    this.gf = gf;
  }

  @Override
  protected boolean isValidValue(String value) {
    if (value.trim().length() == 0) return false;
    //check with regular expression
    Matcher m = NETID_PATTERN.matcher(value);
    if (!m.matches()) return false;
    //then check Motion to see if it exists
    try {
      String motionUrl = gf.getConfigProperty("motion.basepath");
      CloseableHttpClient client = HttpClients.createDefault();
      HttpPost httpPost = new HttpPost(motionUrl);
      String json = "{\"query\":\"{users(filter: { netids:[%s] }){netid}}\"}";
      String query = String.format(json,"\\\"" + value.trim() + "\\\"");
      httpPost.setEntity(new StringEntity(query, "UTF-8"));
      httpPost.setHeader("content-type", "application/json");
      httpPost.setHeader("authorization", "Bearer " + gf.getConfigProperty("motion.bear.token"));
      CloseableHttpResponse response = client.execute(httpPost);
      HttpEntity entity = response.getEntity();
      String result = EntityUtils.toString(entity);
      JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
      JsonObject data = obj.getAsJsonObject("data");
      JsonArray users = data.getAsJsonArray("users");
      client.close();
      if (users.size() == 0) return false;
    } catch(Exception e) {
      e.printStackTrace();
      return false;
    }
    return true;
  }
}