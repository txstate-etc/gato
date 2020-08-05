[#macro enclose includes code depth]
  [#if depth gte includes?size]
    ${code}
  [#else]
    jQuery.getScript('${includes[depth]}', function () {
      [@enclose includes=includes code=code depth=depth+1/]
    });
  [/#if]
[/#macro]

[#macro pageCustomJS page isAncestor]
	[#if page.customjs?has_content]
		[#list cmsfn.children(page.customjs, 'mgnl:component') as entry]
			[#local code = cmsfn.decode(entry).customJS!'']
			[#local code = code?replace('<script[^>]*>([\\s\\S]+)</script>','$1','r')]
			[#local code][@enclose includes=gatojs.getIncludes(entry.includes) code=code depth=0 /][/#local]
			[#if (entry.inherit!false) || !isAncestor]
				[#if entry.framework == "prototype"]
					$(document).observe('dom:loaded', function () {
						${code}
					});
				[#elseif entry.framework == "jquery"]
					jQuery(document).ready(function ($) {
						${code}
					});
				[#else]
					${code}
				[/#if]
			[/#if]
		[/#list]
	[/#if]
[/#macro]

[#macro customJS page ancestorstopdown]
  [@inheritLoop page ancestorstopdown ; curr, isAncestor]
    [@pageCustomJS page=curr isAncestor=isAncestor /]
  [/@inheritLoop]
[/#macro]

[#macro pageCustomCSS page isAncestor]
	[#if page.customcss?has_content]
		[#list cmsfn.children(page.customcss, 'mgnl:component') as entry]
			[#if (entry.inherit!false) || !isAncestor]
				${gf.tidyCSS(cmsfn.decode(entry).customCSS!'')}
			[/#if]
		[/#list]
	[/#if]
[/#macro]

[#macro customCSS page ancestorstopdown]
  <style type="text/css">
  [#compress]
		[@inheritLoop page ancestorstopdown ; curr, isAncestor]
			[@pageCustomCSS page=curr isAncestor=isAncestor /]
		[/@inheritLoop]
  [/#compress]
  </style>
[/#macro]

[#macro cssjsmodals]
	[#if cmsfn.isEditMode()]
    <div id="gato-customjs-modal" class="gato-custom-column">
      [@cms.area name="customjs" /]
		</div>
    <div id="gato-customcss-modal" class="gato-custom-column">
      [@cms.area name="customcss" /]
		</div>
	[/#if]
[/#macro]
