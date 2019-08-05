[#assign items = components]
[#if ctx.alphabetize]
  [#assign items = gf.sortFilterableSearchItems(components, 'text')]
  [#if cmsfn.isEditMode()]
    <div class="txst-khan-notice">
      List items are currently displayed in alphabetical order. Moving items in the editing environment
      will not have a visual effect.
    </div>
  [/#if]
[/#if]
[#list items as component]
    [@cms.component content=component /]
[/#list]
[#if cmsfn.isEditMode()]
  <div class="styled-list-item-add" cms:add="box"></div>
[/#if]
