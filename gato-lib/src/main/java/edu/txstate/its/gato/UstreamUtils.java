package edu.txstate.its.gato;

import info.magnolia.objectfactory.Components;
import info.magnolia.init.MagnoliaConfigurationProperties;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.GetMethod;

import java.io.IOException;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;

public class UstreamUtils {
  private static final Logger log = LoggerFactory.getLogger(UstreamUtils.class);

  public static final Pattern CHANNEL_PATTERN = Pattern.compile("^https?://www\\.ustream\\.tv/channel/([^/]*)/?$");

  public static String getChannelId(String channelName) {
    String apiUrl = "http://api.ustream.tv/json/channel/" + channelName + "/getChannelId";

    // Check for Ustream developer key in properties. The request still works without the key, so dev instances
    // without a key should still work for testing purposes.
    MagnoliaConfigurationProperties mcp = Components.getComponent(MagnoliaConfigurationProperties.class);
    String key = mcp.getProperty("gato.ustream.key");
    if (key != null) {
      apiUrl += "?key=" + key;
    }

    GetMethod method = new GetMethod(apiUrl);
    HttpClient client = new HttpClient();
    String json;
    int status;
    try { 
      status = client.executeMethod(method);
      json = new String(method.getResponseBody());
    } catch (IOException e) {
      e.printStackTrace();
      return "";
    }

    if (status != 200) {
      log.warn("received status " + status + " from ustream channel api request");
      return "";
    }

    Gson gson = new Gson();
    UstreamResult result = gson.fromJson(json, UstreamResult.class);

    if (result.results > 0) {
      return ""+result.results;
    } else {
      log.warn("received bad response from ustream channel api {channel=" + channelName + ", msg=" + result.msg + ", error=" + result.error + "}");
      return "";
    }
  }

  public class UstreamResult {
    public int results = -1;
    public String msg;
    public String error;
  }
}
