[#if ctx.index??]
[#assign bgclass= (ctx.index%2 == 0)?then("even", "odd")]
[/#if]
<li class="styled-list-item ${bgclass!}">
[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]
[#if !gf.isEmptyString(content.link)]
  <a href="${gf.filterUrl(content.link)}">
[/#if]

${content.text}

[#if !gf.isEmptyString(content.link)]
  </a>
[/#if]
</li>
