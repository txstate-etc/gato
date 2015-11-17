[#macro pageCustomJS page isAncestor]
	[#if page.customjs?has_content]
		[#list cmsfn.children(page.customjs, 'mgnl:component') as entry]
			[#local code = cmsfn.decode(entry).customJS?replace("<script.*?>", "", "r")?replace("</script>", "", "r")]
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
	<script type="text/javascript">
		[@inheritLoop page ancestorstopdown ; curr, isAncestor]
			[@pageCustomJS page=curr isAncestor=isAncestor /]
		[/@inheritLoop]
	</script>
[/#macro]

[#macro pageCustomCSS page isAncestor]
	[#if page.customcss?has_content]
		[#list cmsfn.children(page.customcss, 'mgnl:component') as entry]
			[#if (entry.inherit!false) || !isAncestor]
				${cmsfn.decode(entry).customCSS!}
			[/#if]
		[/#list]
	[/#if]
[/#macro]

[#macro customCSS page ancestorstopdown]
	<style type="text/css">
		[@inheritLoop page ancestorstopdown ; curr, isAncestor]
			[@pageCustomCSS page=curr isAncestor=isAncestor /]
		[/@inheritLoop]
	</style>
[/#macro]

[#macro cssjsmodals]
	[#if cmsfn.isEditMode()]
		[@cms.area name="customjs" /]
		[@cms.area name="customcss" /]
	[/#if]
[/#macro]
