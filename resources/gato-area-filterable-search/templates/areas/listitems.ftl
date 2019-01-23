<div class="filtered-results">
  <span id="result-count" class="result-count">Showing ## Results</span>
  [#if ctx.alphabetize == "none"]
    [#assign items = components]
  [#else]
    [#assign items = gf.sortFilterableSearchItems(components, ctx.alphaBy)]
  [/#if]
  <ul>
  [#list items as component]
    <li class="result">[@cms.component content=component /]</li>
  [/#list]
  </ul>
  <div id="no-results-message" class="message-hidden">
    <div>Your filters produced no results</div>
    Try adjusting or clearing your filters to display more results
  </div>
</div>
