[#assign title = ctx.formModel.getSafeTitle(cmsfn.asJCRNode(content).identifier)!]
<div class="likert-question" id="${title}-id">
  [#if cmsfn.isEditMode()]<div cms:edit="bar"></div>[/#if]
  ${content.title}
</div>
[#list cmsfn.children(ctx.scale) as scaleitem]
  <div class="likert-option">
    <input type="radio" name="${title}" id="${title}${scaleitem?index}" value=${scaleitem.val} aria-label="${scaleitem.label}" aria-describedby="${title}-id"/>
    <span class="mobile-label">${scaleitem.label}</span>
  </div>
[/#list]