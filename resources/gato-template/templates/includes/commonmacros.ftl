[#macro linkifdefined href=""]
  [#if href?has_content]
    <a href="${gf.filterUrl(href)}">[#nested]</a>
  [#else]
    [#nested]
  [/#if]
[/#macro]

[#function getMobileImage desktopImage mobileImage]
  [#if mobileImage?has_content]
    [#assign image = mobileImage]
  [#else]
    [#assign image = desktopImage]
  [/#if]
  [#return image]
[/#function]

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

[#function hasThereBeenSectionWithTitleBefore components counter]
  [#list components as component]
    [#if counter == 1]
      [#return false]
    [/#if]
    [#if !gf.isEmptyString(component.title)]
      [#return true]
    [#elseif component?counter==(counter-1)]
      [#return false]
    [/#if]
  [/#list]
  [#return false]
[/#function]

[#function getFirstObject objects]
  [#list objects as object]
    [#return object]
  [/#list]
[/#function]