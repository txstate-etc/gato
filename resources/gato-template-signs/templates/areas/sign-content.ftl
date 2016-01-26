[#assign page=cmsfn.page(content)]
<div class="sign-frame" style="width: 1920px; height: ${1920/(page.ar!1.6667)}px;">
	[#list components as component]
		<cms:component content="${component}"/>
	[/#list]
</div>
