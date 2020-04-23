<a href="${gf.filterUrl(content.link)}" class="gato-articlelink-link">${gf.filterLinkTitle(content.title, content.link)}</a>
[#if content.author?has_content || content.articledate?has_content || content.summary?has_content]
  <br>
  [#if content.author?has_content]
    <span class="gato-articlelink-author"><span class="by">by</span> ${content.author}</span>
  [/#if]
  [#if content.articledate?has_content]
    [#if content.author?has_content]<span class="interpunct">&middot;</span>[/#if]
    <span class="gato-articlelink-date">${content.articledate?string["MMM d, yyyy"]}</span>
  [/#if]
  [#if content.summary?has_content]
    <div class="gato-articlelink-summary">${content.summary}</div>
  [/#if]
  <a href="${gf.filterUrl(content.link)}" class="gato-articlelink-more">Read More <span class="visuallyhidden">about ${content.title}</span></a>
[/#if]
