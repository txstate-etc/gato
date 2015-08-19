[#macro javascript scripts]
	[#list ['gato-lib/js/jquery.js', 'gato-lib/js/gato-lib.js'] + scripts as script]
		<script type="text/javascript" src="${ctx.contextPath}/.resources/${script}"></script>
	[/#list]
[/#macro]

[#macro css files]
	[#list files as file]
		<link rel="stylesheet" type="text/css" href="${ctx.contextPath}/.resources/${file}"></script>
	[/#list]
[/#macro]

[#macro alsoInheritFrom page ancestors]
	[#list ancestors as anc]
		[#nested page=anc isAncestor=true /]
	[/#list]
	[#nested page=page isAncestor=false /]
[/#macro]

[#macro pageCustomJS page isAncestor]
	[#list page.customJS as entry]
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
[/#macro]

[#macro customJS page ancestorstopdown]
	<script type="text/javascript">
		[@alsoInheritFrom page ancestorstopdown]
			[@pageCustomJS page=page isAncestor=isAncestor /]
		[/@alsoInheritFrom]
	</script>
[/#macro]

[#macro pageCustomCSS page isAncestor]
	[#list page.customCSS as entry]
		[#if entry.inherit || !isAncestor]
			${cmsfn.decode(entry).customCSS}
		[/#if]
	[/#list]
[/#macro]

[#macro customCSS page ancestorstopdown]
	<style type="text/css">
		[@alsoInheritFrom page ancestorstopdown]
			[@pageCustomCSS page=page isAncestor=isAncestor /]
		[/@alsoInheritFrom]
	</style>
[/#macro]