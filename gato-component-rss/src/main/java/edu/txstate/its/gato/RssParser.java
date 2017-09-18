package edu.txstate.its.gato;

import java.net.URL;
import java.util.Calendar;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class RssParser {
  public RssParser() {
  }

  public RssFeed getFeed(URL source) {
    RssFeed ret = new RssFeed();
    Document doc = Jsoup.connect(source.toString()).get();
    Element feed = doc.select("feed, channel").first();

    ret.setTitle(feed.select("> title").html());

    String link = feed.select("> link").text());
    if (StringUtils.isBlank(link)) link = feed.select("> link").attr("href");
    ret.setLink(link);

    ret.setDescription(feed.select("> description, > subtitle").html());

    String date = feed.select("> pubDate, > updated").text();
    ret.setPublishedDate(parseDate(date));


  }

  protected Calendar parseDate(String s) {
    s = s.replaceAll("Z$", "+0000");
    Date d = DateUtils.parseDate(s,
      "EEE, dd MMM yy HH:mm:ss zzz",
      "EEE, dd MMM yyyy HH:mm:ss zzz",
      "yyyy-MM-dd'T'HH:mm:ssZZZZZ",
      "yyyy-MM-dd'T'HH:mm:ss.SSSZZZZZ"
    );
    Calendar ret = Calendar.getInstance();
    ret.setTime(d);
    return ret;
  }
}
