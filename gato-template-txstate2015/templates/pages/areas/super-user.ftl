[#assign isMobile = ctx.getAttribute("isMobile")]
[#assign divClass = isMobile?string('mobile_super_user', 'super_user')]
[#assign mobileList = isMobile?string('mobile_super_list', '')]

<div class="${divClass}">
	<ul class="super_list ${mobileList}">
		[#list components as component ]
        	<li>[@cms.component content=component /]</li>
    	[/#list]	
	</ul>
</div>