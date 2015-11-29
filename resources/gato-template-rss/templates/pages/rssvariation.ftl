[#compress]
[#include "/gato-template/templates/includes/head.ftl"]
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
<pubDate>${gf.getModificationDate(content)?string["EEE, dd MMM yyyy HH:mm:ss Z"]}</pubDate>
<lastBuildDate>${.now?string["EEE, dd MMM yyyy HH:mm:ss Z"]}</lastBuildDate>

[#list gf.searchComponentsOnPageOrderByModDate(content, [
    'gato-template:components/textimage'
  ]) as content]
  [#include cmsfn.metaData(content,'mgnl:template')?replace('^.*?:', '/gato-template-rss/templates/', 'r')+'.ftl']
[/#list]
</channel>
</rss>
[/#compress]
