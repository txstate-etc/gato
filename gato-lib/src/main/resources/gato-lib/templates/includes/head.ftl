[#macro javascript scripts]
	<script type="text/javascript" src="${ctx.contextPath}/.resources/gato-lib/js/jquery.js"></script>
	<script type="text/javascript">jQuery.noConflict();</script>
	[#list ['gato-lib/js/prototype.js', 'gato-lib/js/gato-lib.js'] + scripts as script]
		<script type="text/javascript" src="${ctx.contextPath}/.resources/${script}"></script>
	[/#list]
[/#macro]

[#macro css files]
	[#list files as file]
		<link rel="stylesheet" type="text/css" href="${ctx.contextPath}/.resources/${file}"/>
	[/#list]
[/#macro]

[#macro inheritLoop page ancestors]
	[#list ancestors as anc]
		[#nested anc, true /]
	[/#list]
	[#nested page, false /]
[/#macro]

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