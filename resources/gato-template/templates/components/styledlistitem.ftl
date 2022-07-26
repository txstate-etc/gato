[#if ctx.index??]
[#assign bgclass= (ctx.index%2 == 0)?then("even", "odd")]
[/#if]
<li class="styled-list-item ${bgclass!}">
[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]
[#if !gf.isEmptyString(content.link)]
  [#if gf.filterUrl(content.link)?matches("^(\\w+:)?//.*$") && !content.link?lower_case?contains("txstate.edu") && !content.link?lower_case?contains("txst.edu")]
    [#assign isExternal = true]
  [#else]
    [#assign isExternal = false]
  [/#if]
  <a class="styled-link [#if isExternal!false]external[/#if]" href="${gf.filterUrl(content.link)}">
[/#if]

${content.text}

[#if !gf.isEmptyString(content.link)]
  </a>
[/#if]
</li>
