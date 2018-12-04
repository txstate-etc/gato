<div class="filtered-results">
  Showing ## Results
  <ul>
  [#list components as component]
    <li>[@cms.component content=component contextAttributes={"includeAlphabetFilters":ctx.includeAlphabetFilters}/]</li>
  [/#list]
  </ul>
</div>
