<div class="filtered-results" data-headers=${(ctx.alphabetize == "alphaheaders")?then("true", "false")}>
  <div class="anchor-link-container" role="navigation" aria-label="Alphabetical Index">
    <button class="alpha-arrow left"><i class="fa fa-arrow-circle-o-left" aria-hidden="true"></i><span class="visuallyhidden">Scroll left</span></button>
    <ul class="alphabet-anchors" id="alphabet-index">
    </ul>
    <button class="alpha-arrow right"><i class="fa fa-arrow-circle-o-right" aria-hidden="true"></i><span class="visuallyhidden">Scroll right</span></button>
  </div>
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
  <div id="result-list">
    <ul class="results">
    [#list items as component]
      <li class="result">[@cms.component content=component/]</li>
    [/#list]
    [#if cmsfn.isEditMode()]
    <li class="result additem"><div class='fs-${ctx.itemLabelClass!"item"}-add' cms:add="box"></div></li>
    [/#if]
    </ul>
  </div>
  <div id="no-results-message" class="message-hidden">
    <div>Your filters produced no results</div>
    Try adjusting or clearing your filters to display more results
  </div>
  <div id="more-content-popup">
    <div tabindex="0" class="fspopup-focusstart sr-only"></div>
    <button id="btn-close-more-content-popup">
      <i class="fa fa-close" aria-hidden="true" aria-label="Close Popup"></i>
      <span>CLOSE<span class="visuallyhidden hidden-title"></span></span>
    </button>
    <div class="popup-content">
    </div>
    <div tabindex="0" class="fspopup-focusend sr-only"></div>
  </div>
</div>
