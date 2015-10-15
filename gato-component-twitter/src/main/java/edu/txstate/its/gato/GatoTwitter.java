package edu.txstate.its.gato;

import info.magnolia.module.ModuleLifecycle;
import info.magnolia.module.ModuleLifecycleContext;
import info.magnolia.cms.core.SystemProperty;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GatoTwitter implements ModuleLifecycle {
  private static final Logger log = LoggerFactory.getLogger(GatoTwitter.class);

  public static final String MODULE_GATO_TWITTER = "gato-component-twitter";
  public static final String TS_ACTIVE = "active";
  public static final String TS_TOKEN = "OAuthAccessToken";
  public static final String TS_TOKEN_SECRET = "OAuthAccessTokenSecret";
  public static final String TS_KEY = "OAuthConsumerKey";
  public static final String TS_SECRET = "OAuthConsumerSecret";

  private TweetStreamer tweetStreamer;
  private Map<String, String> tweetStreamerConfiguration = new HashMap<String, String>();

  public GatoTwitter() {
  }

  public boolean isActive() {
    if ("true".equals(SystemProperty.getProperty("gato.skipscheduler"))) return false;
    String active = tweetStreamerConfiguration.get(TS_ACTIVE);
    return "true".equalsIgnoreCase(active);
  }

  public TweetStreamer getTweetStreamer() {
    if (tweetStreamer == null) {
      tweetStreamer = new TweetStreamer(
        tweetStreamerConfiguration.get(TS_KEY),
        tweetStreamerConfiguration.get(TS_SECRET),
        tweetStreamerConfiguration.get(TS_TOKEN),
        tweetStreamerConfiguration.get(TS_TOKEN_SECRET)
      );
    }
    return tweetStreamer;
  }

  public Map<String, String> getTweetStreamerConfiguration() {
    return tweetStreamerConfiguration;
  }

  public void setTweetStreamerConfiguration(Map<String, String> tweetStreamerConfiguration) {
    this.tweetStreamerConfiguration = tweetStreamerConfiguration;
  }

  public void start(ModuleLifecycleContext moduleLifecycleContext) {
    if (isActive()) {
      log.info("About to start TweetStreamer");
      getTweetStreamer().startStream();
    }
  }

  public void stop(ModuleLifecycleContext moduleLifecycleContext) {
    if (tweetStreamer != null) {
      log.info("About to shutdown TweetStreamer");
      tweetStreamer.stopStream();
      tweetStreamer = null;
    }
  }
}
