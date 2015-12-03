[#include "/gato-template-rss/templates/includes/lib.ftl"]
[@rssitem node=content]
  ${gf.processRichText(cmsfn.decode(content).content)}
[/@rssitem]
