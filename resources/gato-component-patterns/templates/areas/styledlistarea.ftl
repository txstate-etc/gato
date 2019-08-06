[#assign items = components]
[#if ctx.alphabetize]
  [#assign items = gf.sortFilterableSearchItems(components, 'text')]
[/#if]
<div class="styled-list-flex-container">
[#assign total = items?size]
[#assign minColumnSize = (total/(ctx.columns?number))?floor]
[#assign remainder = total%(ctx.columns?number)]

[#assign i = 0]
[#list 1..ctx.columns?number as column]
  [#if column?counter <= remainder]
    [#assign itemsInColumn = minColumnSize + 1]
  [#else]
    [#assign itemsInColumn = minColumnSize]
  [/#if]

  <ul class="gato-styled-list columns-${ctx.columns?number}">
  [#list items[i..*itemsInColumn] as component]
      [@cms.component content=component contextAttributes={"index": i}/]
      [#assign i = i + 1]
  [/#list]
  </ul>

[/#list]
</div>

[#if cmsfn.isEditMode()]
  <div class="styled-list-item-add" cms:add="box"></div>
[/#if]
