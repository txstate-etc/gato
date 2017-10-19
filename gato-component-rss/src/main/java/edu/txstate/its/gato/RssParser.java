package edu.txstate.its.gato;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class RssParser {
  public RssParser() {
  }

  public RssFeed getFeed(String source) throws IOException {
    RssFeed ret = new RssFeed();
    Document doc = Jsoup.connect(source).get();
    Element feed = doc.select("feed, channel").first();

    ret.setTitle(feed.select("> title").html());

    String link = feed.select("> link").text();
    if (StringUtils.isBlank(link)) link = feed.select("> link").attr("href");
    ret.setLink(link);

    ret.setDescription(feed.select(":root > description, :root > subtitle").html());

    String date = feed.select(":root > pubDate, :root > updated").text();
    ret.setPublishedDate(parseDate(date));

    String image = feed.select(":root > image url, :root > logo").text();
    ret.setThumbnail(image);

    for (Element item : feed.select(":root > item, :root > entry")) {
      System.out.println(item.outerHtml());
      RssItem r = new RssItem();
      r.setGuid(item.select(":root > guid, :root > id").eq(0).text());
      r.setPublishedDate(parseDate(item.select(":root > pubDate, :root > updated").text()));
      r.setTitle(item.select("> title").html());

      if (item.select("> summary").size() > 0)
        r.setDescription(item.select("> summary").text());
      else
        r.setDescription(item.select(":root > content, :root > description").text());

      if (item.select("> content").size() > 0)
        r.setContent(item.select("> content").html());
      else
        r.setContent(item.select(":root > summary, :root > description").html());

      String thumbnail = item.select("media|thumbnail").attr("url");
      if (StringUtils.isBlank(thumbnail)) thumbnail = item.select("g|image_link").text();
      if (StringUtils.isBlank(thumbnail)) thumbnail = item.select("> link[rel=enclosure][type^=image]").eq(0).text();
      r.setThumbnail(thumbnail);

      String itemlink = item.select("> link").text();
      if (StringUtils.isBlank(itemlink)) itemlink = item.select("> link[rel=via]").attr("href");
      if (StringUtils.isBlank(itemlink)) itemlink = item.select("> link[rel=alternate]").attr("href");
      if (StringUtils.isBlank(itemlink)) itemlink = item.select("> link[rel=related]").attr("href");
      r.setLink(itemlink);

      String author = item.select("> dc|creator").text();
      if (StringUtils.isBlank(author)) author = item.select("> author > name").text();
      if (StringUtils.isBlank(author)) author = item.select("> contributor > name").eq(0).text();
      if (StringUtils.isBlank(author)) author = item.select("> author").text();
      r.setAuthor(author);

      ret.addItem(r);
    }
    return ret;
  }

  protected Calendar parseDate(String s) {
    s = s.replaceAll("Z$", "+0000");
    Calendar ret = Calendar.getInstance();
    try {
      Date d = DateUtils.parseDate(s,
        "EEE, dd MMM yy HH:mm:ss zzz",
        "EEE, dd MMM yyyy HH:mm:ss zzz",
        "yyyy-MM-dd'T'HH:mm:ssZZZZZ",
        "yyyy-MM-dd'T'HH:mm:ss.SSSZZZZZ"
      );
      ret.setTime(d);
    } catch (Exception e) {
      // ignore
    }
    return ret;
  }
}
