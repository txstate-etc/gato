[#macro pageCustomJS page isAncestor]
	[#if page.customJS?has_content]
		[#list cmsfn.children(page.customJS) as entry]
			[#local code = cmsfn.decode(entry).customJS]
			[#if entry.inherit || !isAncestor]
				[#if entry.framework == "prototype"]
					$(document).observe('dom:loaded', function () {
						${code}
					});
				[#elseif content.framework == "jquery"]
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
	[#if page.customCSS?has_content]
		[#list cmsfn.children(page.customCSS) as entry]
			[#if entry.inherit || !isAncestor]
				${cmsfn.decode(entry).customCSS}
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
