<div class="filter-container" id="filter-container">
  <span class="filter-by">Filter by:</span>
  [#if ctx.includeAlphabetFilters]
    [#assign letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']]
    <ul class="alpha-filters" role="radiogroup">
    [#list letters as letter]
    <li>
      <label for="filter-${letter}">
        <input class="radio-letter" id="filter-${letter}" type="radio" name="alpha-filter" value="${letter}" aria-checked="false" data-group="alphabet">
        <span>${letter}</span>
      </label>
    </li>
    [/#list]
    </ul>
    <div class="active-letters">
    </div>
  [/#if]
  <ul>
  [#list components as component]
    <li>[@cms.component content=component /]</li>
  [/#list]
  [#if cmsfn.isEditMode()]
  <li><div cms:add="bar"></div></li>
  [/#if]
  </ul>
  <button class="btn-clear-filters"><i class="fa fa-refresh" aria-hidden="true"></i>Reset</button>
</div>
