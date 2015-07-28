[#--some formatting seems to be lost when the content is stored in ctx--]
[#assign homePageContent = ctx.getAttribute('homePageContent')]
[#assign contact = homePageContent.contactInformation]
<h3 class="contact_us">
	<a href="#nowhere">${homePageContent.title}</a>
</h3>
<div class="office_contact_2">
	[#if contact.address??]
		<p class="dept_address dept_info">
			${contact.address}
		</p>
	[/#if]
	[#if contact.phone??]
		<p class="dept_phone dept_info">Phone: ${contact.phone}</p>
	[/#if]
	[#if contact.fax??]
		<p class="dept_fax dept_info">Fax: ${contact.fax}</p>
	[/#if]
	[#if contact.email??]
		<p class="dept_email dept_info">Email: <a href="mailto:${contact.email}">${contact.email}</a></p>
	[/#if]
</div>	