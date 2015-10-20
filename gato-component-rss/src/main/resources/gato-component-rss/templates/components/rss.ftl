[#if !faqButtonsAdded!false]
  <div class="gato-faq-expand-collapse">
    <a href="#" id="txst-expand-all-faqs">Expand</a> or
    <a href="#" id="txst-collapse-all-faqs">Collapse</a> all.
  </div>
  [#global "faqButtonsAdded" = true]
[/#if]

[#if model.error?has_content]

  <div class="txst-rss-error">
    There was an error retrieving the news feed.
  </div>

[#else]

  [#if !(content.hideFeedInformation!false)]
    <div class="txst-rss-feedinformation">
      [#if model.feed.image?has_content]
        [#if model.feed.link?has_content]
          <a href="${model.feed.link}" class="txst-rss-feedimage">
            <img src="${model.feed.image.url}" />
          </a>
        [#else]
          <img src="${model.feed.image.url}" class="txst-rss-feedimage" />
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

  [#list model.items as entry]
    <div class="txst-rss-item ${model.collapsible?string('collapsible', '')}">
      <h3 class="${model.collapsed?string('collapsed', '')}">
        <a href="${entry.link}">${entry.title}</a>
      </h3>
      <div class="txst-rss-item-content">
        <div class="gato-rss-published">
          [#if entry.publishedDate?has_content && content.showDates!false]
            <span class="gato-rss-date">
              ${entry.publishedDate?string["MMMM d, yyyy"]}
            </span>
            <span class="gato-rss-time">
              ${entry.publishedDate?string[" h:mma"]}
            </span>
          [/#if]
        </div>
        [#if !model.hideArticleText]
          <div class="txst-rss-itemdescription">
            <div class="txst-rss-itemdescription-content">
              ${model.fmtItemText(entry)}
            </div>
            <div class="txst-rss-more-link">
              <a href="${entry.link}">Read more</a>
            </div>
          </div>
        [/#if]
      </div>
    </div>
  [/#list]

[/#if]
