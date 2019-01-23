<div class="filtered-results" data-headers=${(ctx.alphabetize == "alphaheaders")?then("true", "false")}>
  <span id="result-count" class="result-count">Showing ## Results</span>
  [#if ctx.alphabetize == "none"]
    [#assign items = components]
  [#else]
    [#assign items = gf.sortFilterableSearchItems(components, ctx.alphaBy)]
    [#if cmsfn.isEditMode()]
    <div class="txst-khan-notice">
      List items are currently displayed in alphabetical order. Moving items in the editing environment
      will not have a visual effect.
    </div>
    [/#if]
  [/#if]
  <ul>
  [#list items as component]
    <li class="result">[@cms.component content=component/]</li>
  [/#list]
  </ul>
  <div id="no-results-message" class="message-hidden">
    <div>Your filters produced no results</div>
    Try adjusting or clearing your filters to display more results
  </div>
</div>
