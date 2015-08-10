[#assign isMobile = ctx.getAttribute("isMobile")]
[#assign divClass = isMobile?string('mobile_super_user', 'super_user')]
[#assign mobileList = isMobile?string('mobile_super_list', '')]
<div class="${divClass}">
	
	<ul class="super_list ${mobileList}">
	
	
		[#-- This is how to create the menu from jcr content.--]
		[#--list cmsfn.children(content.links) as menuItem--]
			[#--<li><a href="${menuItem.url}">${menuItem.title}</a></li> --]
		[#--/#list--]
		
		
		<li><a href="#">Bobcat Mail</a></li>
		<li><a href="#">Catsweb</a></li>
		<li><a href="#">Tracs</a></li>
		<li><a href="#">Catalogs</a></li>
		<li><a href="#">Pay Tuition</a></li>
		<li><a href="#">Library</a></li>
		<li><a href="#">Maps</a></li>
	
	</ul>
</div>