[#include "/gato-template/templates/includes/commonmacros.ftl"]
<div class="gato-twitter-feed">
  [#if content.title?has_content]
    [@h2 class="level1header"]${content.title}[/@h2]
  [/#if]

  <div class="gato-twitter-list">

      [#list model.tweets as tweet]
        [@compress single_line=true]
        <div class="tweet" id="tweet-${tweet.id}">

          <a class="tweet-logo-link" href="https://twitter.com/${tweet.screenName}" title="@${tweet.screenName}">
            <img class="tweet-logo" alt="Icon for user ${tweet.screenName}" src="${tweet.icon}"/>
          </a>

          <div class="tweet-body">

            <div class="screen-name">
              <a href="https://twitter.com/${tweet.screenName}">@${tweet.screenName}</a>
            </div>

            <div class="text">${tweet.text}</div>

            <a class="created_at timestamp relative" data-timestamp="${tweet.createdAt}" title="Time posted: ${tweet.createdAt}" href="https://twitter.com/${tweet.screenName}/status/${tweet.id}">
              ${tweet.createdAt}
            </a>

          </div>
        </div>
        [/@compress]
      [/#list]

      [#if cmsfn.editMode && (model.termCount == 0 || model.resultCount == 0 || !model.messages?has_content)]
        <div class="txst-khan-alert txst-khan-notice txst-tweet-alert">

          [#if model.termCount == 0]
            <p>No valid query parameters entered.</p>
            <p>Only <strong>@screen_names</strong> and <strong>#hashtags</strong> are supported.</p>
          [/#if]

          [#if model.termCount gt 0 && model.resultCount == 0]
            <p>
              It may take up to five minutes for tweets to show up.
              If it has been longer than five minutes, double check your search
              parameters for misspellings.
            </p>
          [/#if]

          [#if model.messages?has_content]
            <div class="tweet-error">
              <h3 class="tweet-error">Note:</h3>
              [#list model.messages as message]
                <p>${message}</p>
              [/#list]
            </div>
          [/#if]
        </div>
      [/#if]

  </div>
</div>
