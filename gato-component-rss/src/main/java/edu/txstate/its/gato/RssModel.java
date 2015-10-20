package edu.txstate.its.gato;

import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.model.RenderingModelImpl;
import info.magnolia.rendering.template.RenderableDefinition;

import com.sun.syndication.feed.synd.SyndFeed;
import com.sun.syndication.feed.synd.SyndEntry;
import com.sun.syndication.feed.synd.SyndContent;
import com.sun.syndication.fetcher.FeedFetcher;
import com.sun.syndication.fetcher.FetcherException;
import com.sun.syndication.fetcher.impl.FeedFetcherCache;
import com.sun.syndication.fetcher.impl.HashMapFeedInfoCache;
import com.sun.syndication.fetcher.impl.HttpURLFeedFetcher;
import com.sun.syndication.io.FeedException;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Collections;

import javax.inject.Inject;
import javax.jcr.Node;

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

  private final boolean startCollapsed;
  private final String displayType;
  private final Exception error;
  private final SyndFeed feed;
  private final List<SyndEntry> items;

  @Inject
  public RssModel(Node content, RD definition, RenderingModel<?> parent) {    
    super(content, definition, parent);
    
    displayType = PropertyUtil.getString(content, "displayType", SUMMARY_ONLY);
    startCollapsed = PropertyUtil.getBoolean(content, "startCollapsed", false);

    Exception error = null;
    SyndFeed feed = null;
    List<SyndEntry> items = null;
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
  public SyndFeed getFeed() { return feed; }
  public List<SyndEntry> getItems() { return items; }

  public String fmtItemText(final SyndEntry item) {
    String itemText = item.getDescription().getValue();
    
    if (SUMMARY_ONLY.equalsIgnoreCase(displayType)) {
      itemText = itemText.replaceAll("\\<[^>]*>", "");
      itemText = StringUtils.abbreviate(itemText, 350);
    } else if (item.getContents().size() > 0) {
      String fullContents = ((SyndContent)item.getContents().get(0)).getValue();
      if (!StringUtils.isBlank(fullContents)) {
        itemText = fullContents;
      }
    }

    return itemText;
  }

  private static SyndFeed fetchFeed(final Node content) throws IOException, MalformedURLException, FeedException, FetcherException {
    final String feedUrl = PropertyUtil.getString(content, "feedUrl", null);
    
    final FeedFetcherCache cache = HashMapFeedInfoCache.getInstance();
    final FeedFetcher feedFetcher = new HttpURLFeedFetcher(cache);
    feedFetcher.setUserAgent("MagnoliaRSSFeedParagraph/0.1 (Java-ROME 0.9; Magnolia 3.5.4; gato@txstate.edu)");
    
    return feedFetcher.retrieveFeed(new URL(feedUrl));
  }

  private static List<SyndEntry> initList(final Node content, final SyndFeed feed) {
    final List<SyndEntry> items = new ArrayList(feed.getEntries());
    final String sortOrder = PropertyUtil.getString(content, "sortOrder", SORT_DESC);

    if (!SORT_NONE.equalsIgnoreCase(sortOrder)) {
      final boolean ascending = SORT_ASC.equalsIgnoreCase(sortOrder);
      Collections.sort(items, new SyndEntryComparator(ascending));
    }

    final int feedlimit = PropertyUtil.getLong(content, "feedlimit", 0l).intValue();
    if (feedlimit > 0 && feedlimit < items.size()) {
      return items.subList(0, feedlimit);
    }

    return items;
  }

  private static class SyndEntryComparator extends Object implements Comparator {
    private final int signum;
    public SyndEntryComparator(final boolean ascending) {
      signum = ascending ? 1 : -1;
    }
    public int compare(final Object a, final Object b) {
      final SyndEntry c = (SyndEntry) a;
      final SyndEntry d = (SyndEntry) b;
      if (c.getPublishedDate() == null && d.getPublishedDate() != null) return signum;
      if (c.getPublishedDate() != null && d.getPublishedDate() == null) return -1*signum;
      if (c.getPublishedDate() == null && d.getPublishedDate() == null) return 0;
      return signum*c.getPublishedDate().compareTo(d.getPublishedDate());
    }
  }

}
