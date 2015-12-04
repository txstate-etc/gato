package edu.txstate.its.gato;

import info.magnolia.context.MgnlContext;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.model.RenderingModelImpl;
import info.magnolia.rendering.template.RenderableDefinition;
import info.magnolia.repository.RepositoryConstants;
import info.magnolia.templating.functions.TemplatingFunctions;

import java.text.SimpleDateFormat;
import java.util.regex.Pattern;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TwitterModel<RD extends RenderableDefinition> extends RenderingModelImpl<RD> {
  private static final Logger log = LoggerFactory.getLogger(TwitterModel.class);

  private static final String TWEET_QUERY_FORMAT = "//global-data/twitter/tweets//element(*,mgnl:contentNode)[%s] order by @tweet_id descending";
  private static final String USER_QUERY_FORMAT = "//global-data/twitter/user_map/*[%s]";

  private static final SimpleDateFormat PARSER = new SimpleDateFormat("EEE MMM d HH:mm:ss Z yyyy");
  private static final SimpleDateFormat FORMATTER = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");      
  static { FORMATTER.setTimeZone(TimeZone.getTimeZone("UTC")); }

  private List<Tweet> tweets = new ArrayList<Tweet>();
  private int termCount = 0;
  private int resultCount = 0;
  private List<String> messages = new ArrayList<String>();

  @Inject
  public TwitterModel(Node content, RD definition, RenderingModel<?> parent, TemplatingFunctions tf, GatoUtils gf) {    
    super(content, definition, parent);
    try {
      buildTweetList(content, tf, gf);
    } catch (Exception e) {
      log.error("Failed to build Tweet list.", e);
    }
  } 
  
  public List<Tweet> getTweets() {
    return tweets;
  }

  public int getTermCount() {
    return termCount;
  }

  public int getResultCount() {
    return resultCount;
  }

  public List<String> getMessages() {
    return messages;
  }

  private void buildTweetList(Node content, TemplatingFunctions tf, GatoUtils gf) throws RepositoryException {
    // String icon = PropertyUtil.getString(content, "image", "");
    // if (StringUtils.isNotBlank(icon) && icon.startsWith("/")) {
    //   icon = (String)request.getAttribute("assetsUrl") + icon;
    // }

    String[] terms = PropertyUtil.getString(content, "query", "").split("[\\s,]");
    ArrayList<String> names = new ArrayList<String>(terms.length);
    StringBuilder tweetQuery = new StringBuilder();
    StringBuilder userQuery = new StringBuilder();
    for(int i = 0; i < terms.length; i++) {
      String term = terms[i].trim();
      if(StringUtils.isNotBlank(term) && term.length() > 1) {
        if (term.startsWith("@")) {
          if (tweetQuery.length() > 0) {
            tweetQuery.append(" or ");
          }
          if (userQuery.length() > 0) {
            userQuery.append(" or ");
          }
          String name = term.substring(1).toLowerCase();
          names.add(name);
          tweetQuery.append("fn:lower-case(@screen_name)='").append(name).append("'");
          userQuery.append("fn:lower-case(fn:name())='").append(name).append("'");
          termCount++;
        } else if (term.startsWith("#")) {
          if (tweetQuery.length() > 0) {
            tweetQuery.append(" or ");
          }
          tweetQuery.append("jcr:contains(@hashtags, '").append(term.substring(1)).append("')");
          termCount++;
        }
      }
    }

    Session ws = MgnlContext.getJCRSession(RepositoryConstants.WEBSITE);
    QueryManager manager = ws.getWorkspace().getQueryManager();

    if (tweetQuery.length() > 0) {
      Query query = manager.createQuery(String.format(TWEET_QUERY_FORMAT, tweetQuery), javax.jcr.query.Query.XPATH);

      NodeIterator iter = NodeUtil.filterDuplicates(query.execute().getNodes());

      int max = PropertyUtil.getLong(content, "count", Long.valueOf(Integer.MAX_VALUE)).intValue();
      boolean ignoreReplies = PropertyUtil.getBoolean(content, "ignoreReplies", false);

      while(iter.hasNext() && resultCount < max) {
        Node node = iter.nextNode();

        boolean isReply = PropertyUtil.getBoolean(node, "reply", false);
        if (isReply && ignoreReplies) {
          continue;
        }

        resultCount++;

        String text = PropertyUtil.getString(node, "text", "");

        //parse urls, hashtags, and twitter names from text and convert to links
        text = gf.linkifyTweet(text);
        
        Tweet tweet = new Tweet();
        tweet.id = PropertyUtil.getString(node, "tweet_id", "");
        tweet.screenName = PropertyUtil.getString(node, "screen_name", "");
        tweet.text = text;
        // if(StringUtils.isNotBlank(icon)) {
        //   tweet.icon = icon;
        // } else {
          tweet.icon = PropertyUtil.getString(node, "icon", "");
        // }
        tweet.createdAt = formatTimeStamp(PropertyUtil.getString(node, "created_at", ""));

        tweets.add(tweet);

      } // while(iter.hasNext())
    } // if (tweetQuery.length() > 0)

    if (tf.isEditMode() && userQuery.length() > 0) {
      Query query = manager.createQuery(String.format(USER_QUERY_FORMAT, userQuery), javax.jcr.query.Query.XPATH);
      NodeIterator iter = query.execute().getNodes();

      while(iter.hasNext()) {
        Node node = iter.nextNode();
        String name = node.getName();
        if (node.hasProperty("error_status")) {
          Long errorStatus = node.getProperty("error_status").getLong();
          if (errorStatus == 404) {
            messages.add("<strong>@" + name + "</strong> is not an existing twitter account.");
          } else if (errorStatus == 401 || errorStatus == 403) {
            messages.add("<strong>@" + name + "'s</strong> tweets can't be retrieved because they are protected.");
          } else {
            messages.add("<strong>@" + name + "'s</strong> tweets were not retrieved (error " + errorStatus + ").");
          }
        }
      }
    }
  }

  private String formatTimeStamp(String timestamp) {
    try {
      // Times from Twitter look like this: "Thu Aug 27 09:15:19 CDT 2015"
      // Let's format them in ISO8601 to make them easier to parse in javascript
      Date d = PARSER.parse(timestamp);
      return FORMATTER.format(d);
    } catch (Exception e) {
      log.error("Failed to parse Tweet timestamp: '{}'", timestamp, e);
    }
    return timestamp;
  }
}
