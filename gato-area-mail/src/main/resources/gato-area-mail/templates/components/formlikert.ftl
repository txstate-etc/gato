<div class="formelement likert">
  [#if content.title?has_content]
    <h2>${content.title}</h2>
  [/#if]
  [#if content.instructions?has_content]
    <p>${content.instructions}</p>
  [/#if]

  <div class="likert-table" style="--numCol: ${cmsfn.children(content.scale)?size}">
    <div class="empty">&nbsp;</div>
    [#list cmsfn.children(content.scale) as scaleitem]
      <div class="scale-header">${scaleitem.label}</div>
    [/#list]
    [@cms.area name="questions" contextAttributes={ "scale":content.scale, "formModel":ctx.formModel }/]
  </div>
</div>