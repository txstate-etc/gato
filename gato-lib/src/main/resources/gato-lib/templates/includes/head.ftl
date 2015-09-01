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
