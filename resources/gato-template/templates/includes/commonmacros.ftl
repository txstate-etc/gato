[#macro linkifdefined href=""]
  [#if href?has_content]
    <a href="${gf.filterUrl(href)}">[#nested]</a>
  [#else]
    [#nested]
  [/#if]
[/#macro]

[#function hasTallComponent components]
  [#list components as component]
    [#if component.orientation == 'tall']
      [#return true]
      [#break]
    [/#if]
  [/#list]    
 [#return false]  
[/#function]

[#macro navloop items]
	[#list items as item]
		[#if !(item.hideInNav!false)]
			[#nested item]
		[/#if]
	[/#list]
[/#macro]

[#function min(a,b)]
  [#return (b > a)?then(a, b)]
[/#function]
[#macro h2 offset=0 class='']
  [#local headerlevel = min(offset + ctx.headerlevel!2, 6)]
  <h${headerlevel} class="${class}">
  [#nested]
  </h${headerlevel}>
[/#macro]
[#macro h3 offset=0 class='']
  [@h2 offset+1 class][#nested][/@h2]
[/#macro]
[#macro h4 offset=0 class='']
  [@h3 offset+1 class][#nested][/@h3]
[/#macro]

[#function firstSectionWithTitle components counter]
  [#list components as component]
    [#if !gf.isEmptyString(component.title)]
      [#if component?counter == counter]
        [#return true]
      [/#if]
      [#return false]
    [/#if]
  [/#list]
  [#return false]
[/#function]