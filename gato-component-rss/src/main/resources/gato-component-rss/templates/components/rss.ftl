[#if model.error?has_content]

  <div class="gato-rss-error">
    There was an error retrieving the news feed.
  </div>

[#else]
  [#if !(content.hideFeedInformation!false)]
    <div class="gato-rss-feedinformation">
      [#if model.feed.thumbnail?has_content]
        [#if model.feed.link?has_content]
          <a href="${model.feed.link}" class="gato-rss-feedimage">
            <img src="${model.feed.thumbnail}" />
          </a>
        [#else]
          <img src="${model.feed.thumbnail}" class="gato-rss-feedimage" />
        [/#if]
      [/#if]
      [#if model.feed.title?has_content]
        <h2 class="gato-rss-title">${model.feed.title}</h2>
      [/#if]
      [#if model.feed.description?has_content]
        ${model.feed.description}<br/>
      [/#if]
      [#if model.feed.link?has_content]
        <a href="${model.feed.link}">${model.feed.link}</a><br/>
      [/#if]
    </div>
  [/#if]

  [#if model.items?has_content]
    [#include "/gato-lib/templates/includes/accordion.ftl"]
  [/#if]

  [#list model.items as entry]
    <div class="gato-rss-item ${model.collapsible?string('gato-accordion', '')}"
      data-start-collapsed="${model.collapsed?string('true', 'false')}">
      <h3 class="${model.collapsible?string('gato-accordion-header', '')}">
        <a href="${entry.link}">${entry.title!}</a>
      </h3>
      <div class="gato-accordion-content">
        [#if content.showThumbnails!false]
          <div class="gato-rss-thumbnail"><img src="${entry.thumbnail}" alt=""></div>
        [/#if]
        <div class="gato-rss-published">
          [#if entry.publishedDate?has_content && (content.showDates!'none') != 'none']
            <span class="gato-rss-date">
              ${entry.publishedDate?string["MMMM d, yyyy"]}
            </span>
            [#if content.showDates == 'time']
              <span class="gato-rss-time">
                ${entry.publishedDate?string[" h:mma"]}
              </span>
            [/#if]
          [/#if]
        </div>
        [#if !model.hideArticleText]
          <div class="gato-rss-itemdescription">
            <div class="gato-rss-itemdescription-content">
              ${model.fmtItemText(entry)}
            </div>
            <div class="gato-rss-more-link">
              <a href="${entry.link}">Read more</a>
            </div>
          </div>
        [/#if]
      </div>
    </div>
  [/#list]

[/#if]
