[#compress]
[#include "/gato-template-rss/templates/includes/lib.ftl"]
[#include "/gato-template/templates/includes/head.ftl"]
[#assign news = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/news-links', 'website'))]
[#assign news = cmsfn.children(news, "mgnl:component")]

[#assign pubdate = gf.getModificationDate(content)]
[#list news as component]
  [#assign mdate = gf.getModificationDate(component)]
  [#if mdate gt pubdate]
    [#assign pubdate = mdate]
  [/#if]
[/#list]

${ctx.response.setContentType('application/rss+xml;charset=UTF-8')}
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>

<title>${gf.nodeTitle(content)}</title>
<link>${ gf.absoluteUrl(cmsfn.link(content)) }</link>
<atom:link href="${ gf.absoluteUrl(gf.replaceExtension(cmsfn.link(content), 'rss')) }" rel="self" type="application/rss+xml" />
<description>${content.metaDescription!}</description>
<language>en-us</language>
<generator>Gato CMS</generator>
<managingEditor>${gf.getLastAuthor(content)}@txstate.edu</managingEditor>
<webMaster>gato@txstate.edu</webMaster>
<pubDate>${pubdate?string["EEE, dd MMM yyyy HH:mm:ss Z"]}</pubDate>
<lastBuildDate>${.now?string["EEE, dd MMM yyyy HH:mm:ss Z"]}</lastBuildDate>

[#-- FIXME: sort by mod date --]
[#list news as component]
  [#if isEnabled(component)]
    [@rssitem node=component moddate=gf.getModificationDate(component)]
      ${gf.processRichText(cmsfn.decode(component).rsscontent)}
    [/@rssitem]
  [/#if]
[/#list]

</channel>
</rss>
[/#compress]
