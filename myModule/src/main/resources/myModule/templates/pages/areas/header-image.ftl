[#-- TODO: * check to see if the header_image actually exists?  This might be done in header.ftl and this file
	might not even be included if there is no header image.  
			* Figure out why the edit bars don't show up unless there is something in this template besides the empty div. 
			* Add the background image with javascript instead of using an inline style? Can they pick multiple 
	header images that rotate, similar to the old banners?
			* Figure out how to put header images in DAM.  They probably need their own directory.  Can users upload
			their own header images, or do they need to stick to the pre-approved ones? --]

[#assign headerImg = damfn.getAsset("jcr", content.header_image)!]

<div class="bg_image" id="headerImage" style="background-image: url('${headerImg.getLink()}');"></div>

 <script type="text/javascript">
	//This is here because the edit bars don't show up unless there is something here
	//besides the empty div.  WHY?!?
 </script>