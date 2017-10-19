package edu.txstate.its.gato;

import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.model.RenderingModelImpl;
import info.magnolia.rendering.template.RenderableDefinition;

import java.io.IOException;
import java.io.Serializable;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Collections;

import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.RepositoryException;

import org.apache.commons.lang3.StringUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RssModel<RD extends RenderableDefinition> extends RenderingModelImpl<RD> {
  private static final Logger log = LoggerFactory.getLogger(RssModel.class);

  public static final String SUMMARY_ONLY = "showSummaryOnly";
  public static final String TITLE_ONLY = "showTitleOnly";
  public static final String SORT_ASC = "pubDateAsc";
  public static final String SORT_DESC = "pubDateDesc";
  public static final String SORT_NONE = "none";
  public static final RssParser parser = new RssParser();

  private final boolean startCollapsed;
  private final String displayType;
  private final Exception error;
  private final RssFeed feed;
  private final List<RssItem> items;

  @Inject
  public RssModel(Node content, RD definition, RenderingModel<?> parent) {
    super(content, definition, parent);

    displayType = PropertyUtil.getString(content, "displayType", SUMMARY_ONLY);
    startCollapsed = PropertyUtil.getBoolean(content, "startCollapsed", false);

    Exception error = null;
    RssFeed feed = null;
    List<RssItem> items = null;
    try {
      feed = fetchFeed(content);
      items = initList(content, feed);
    } catch (Exception e) {
      log.error("Failed to fetch RSS feed.", e);
      error = e;
    }

    this.feed = feed;
    this.items = items;
    this.error = error;
  }

  public boolean getHideArticleText() { return TITLE_ONLY.equalsIgnoreCase(displayType); }
  public boolean isCollapsible() { return !getHideArticleText(); }
  public boolean isCollapsed() { return isCollapsible() && startCollapsed; }
  public Exception getError() { return error; }
  public RssFeed getFeed() { return feed; }
  public List<RssItem> getItems() { return items; }

  public String fmtItemText(final RssItem item) {
    String itemText = "";
    if (SUMMARY_ONLY.equalsIgnoreCase(displayType)) {
      itemText = item.getDescription();
      itemText = StringUtils.abbreviate(itemText, 350);
    } else {
      itemText = item.getContent();
    }

    return StringUtils.trim(itemText);
  }

  private static RssFeed fetchFeed(final Node content) throws IOException, RepositoryException {
    Node unescapednode = NodeUtil.unwrap(content);
    final String feedUrl = PropertyUtil.getString(unescapednode, "feedUrl", null);
    return parser.getFeed(feedUrl);
  }

  private static List<RssItem> initList(final Node content, final RssFeed feed) {
    final List<RssItem> items = new ArrayList(feed.getItems());
    final String sortOrder = PropertyUtil.getString(content, "sortOrder", SORT_DESC);

    if (!SORT_NONE.equalsIgnoreCase(sortOrder)) {
      final boolean ascending = SORT_ASC.equalsIgnoreCase(sortOrder);
      Collections.sort(items, new ItemComparator(ascending));
    }

    final int feedlimit = PropertyUtil.getLong(content, "feedlimit", 0l).intValue();
    if (feedlimit > 0 && feedlimit < items.size()) {
      return items.subList(0, feedlimit);
    }

    return items;
  }

  private static class ItemComparator extends Object implements Comparator {
    private final int signum;
    public ItemComparator(final boolean ascending) {
      signum = ascending ? 1 : -1;
    }
    public int compare(final Object a, final Object b) {
      final RssItem c = (RssItem) a;
      final RssItem d = (RssItem) b;
      return signum*c.getPublishedDate().compareTo(d.getPublishedDate());
    }
  }

}
