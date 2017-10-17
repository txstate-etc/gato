<div class="gato-card gato-card-rss-container eq-parent ${ctx.cardsize}" data-tags="${content.tags!''}">
    [#if model.error?has_content]
      <div class="gato-rss-error">
        There was an error retrieving the news feed.
      </div>
    [#else]
      [#if !(content.hideFeedInformation!false)]
        <div class="gato-rss-feedinformation">
          [#if content.feedtitle?has_content]
            <h2 class="gato-rss-title"><span>${content.feedtitle}</span></h2>
          [/#if]
        </div>
      [/#if]

      [#list model.items as entry]
        <div class="gato-rss-item">
          <h3 class="gato-rss-item-header">
            <a href="${entry.link}">${entry.title!}</a>
          </h3>
          <div class="rss-item-content">
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
          </div>
        </div>
      [/#list]
    [/#if]
</div>
