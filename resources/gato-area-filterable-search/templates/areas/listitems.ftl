<div class="filtered-results">
  <span id="result-count" class="result-count">Showing ## Results</span>
  <ul>
  [#list components as component]
    <li class="result">[@cms.component content=component contextAttributes={"includeAlphabetFilters":ctx.includeAlphabetFilters!false}/]</li>
  [/#list]
  </ul>
</div>
