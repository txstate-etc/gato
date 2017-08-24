[#include "/gato-template-rss/templates/includes/lib.ftl"]
[@rssitem node=content link=content.link! moddate=content.articledate! author=content.author!]
  ${content.summary}
[/@rssitem]
