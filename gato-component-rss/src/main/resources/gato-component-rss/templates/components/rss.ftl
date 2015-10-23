[#if !ctx.request.getAttribute('accordionloaded')!false]
  ${ctx.request.setAttribute('accordionloaded', true)}

  <div class="gato-accordion-expand-collapse">
    <a href="#" id="gato-accordion-expand-all">Expand</a> or
    <a href="#" id="gato-accordion-collapse-all">Collapse</a> all.
  </div>
[/#if]

[#if model.error?has_content]

  <div class="gato-rss-error">
    There was an error retrieving the news feed.
  </div>

[#else]

  [#if !(content.hideFeedInformation!false)]
    <div class="gato-rss-feedinformation">
      [#if model.feed.image?has_content]
        [#if model.feed.link?has_content]
          <a href="${model.feed.link}" class="gato-rss-feedimage">
            <img src="${model.feed.image.url}" />
          </a>
        [#else]
          <img src="${model.feed.image.url}" class="gato-rss-feedimage" />
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
    <div class="gato-rss-item ${model.collapsible?string('gato-accordion', '')}"
      data-start-collapsed="${model.collapsed?string('true', 'false')}">
      <h3 class="gato-accordion-header">
        <a href="${entry.link}">${entry.title}</a>
      </h3>
      <div class="gato-accordion-content">
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
