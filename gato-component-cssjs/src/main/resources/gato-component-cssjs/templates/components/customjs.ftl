<script type="text/javascript">
	[#if content.framework == "prototype"]
		$(document).observe('dom:loaded', function () {
			${cmsfn.decode(content).customJS}
		});
	[#elseif content.framework == "jquery"]
		jQuery(document).ready(function ($) {
			${cmsfn.decode(content).customJS}
		});
	[#else]
		${cmsfn.decode(content).customJS}
	[/#if]
</script>