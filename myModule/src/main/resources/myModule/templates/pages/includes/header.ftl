<!--
   * Primary page with header image
   * Primary page without header image
   * Secondary page with header image
   * Secondary page without header image

   editable: image, parent organization, Department or office name (title)

   parent organization is collegeLink -> name  There is also a url for the parent organization.

   Is parent organization required now?
-->


<!-- set this div class based on whether or not there is a header image
and whether or not it is a primary or secondary page -->
<div class="header_3">

	<div class="bg_container">
	
		[@cms.area name="headerImage"/]
		
		<div class="overlay">
		 
			<div class="bg_overlay"></div>
			
		</div>
		
	</div>

	<div class="title">
	
		<div class="header_bg"></div>
		<div class="dept_name">
			[@cms.area name="collegeLink"/]
			<h1><a href="${cmsfn.link(content)}">${content.title}</a></h1>
		</div>
		
	</div>
	
</div>

