[#include "/gato-template/templates/includes/component.ftl"]

<h3 class="contact_us">
	<a href="${cmsfn.link(homepage)}">${gf.nodeTitle(homepage)}</a>
</h3>
<div class="office_contact_2 dept_info">
	[#list components as component ]
	   [@cms.component content=component /]
	[/#list]
</div>







[#-- This gives a more structured option for this area--]
[#--
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

--]