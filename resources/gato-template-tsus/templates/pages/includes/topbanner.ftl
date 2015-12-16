<div class="tsus-topbanner-bg">
	<div class="tsus-topbanner">
		<a href="${cmsfn.link(homepage)}" class="tsus-homelink" title="Texas State University System">
			<img src="${gf.resourcePath()}/gato-template-tsus/images/tsus-logo.png" alt="Texas State University System Logo"/>
		</a>
		<ul class="linkmenutop">
      [@cms.area name="menulinks" content=gf.getOrCreateArea(homepage, 'menulinks') editable=isHomePage /]
		</ul>
	  <div class="newslettersignup">
			[@cms.area name="newsletter" content=gf.getOrCreateArea(homepage, 'newsletter') editable=isHomePage /]
		</div>
		<div class="social-media-icons">
			[@cms.area name="socialmedia" content=gf.getOrCreateArea(homepage, 'socialmedia') editable=isHomePage contextAttributes={"icononly": true} /]
		</div>
		<form action="http://search.txstate.edu/search" class="tsus-searchform">
			<input type="text" name="q" id="q" value="Search" class="research search-default"><jsp:text /></input>
			<input type="image" src="${gf.resourcePath()}/gato-template-tsus/images/mag.png" id="tsus-searchform-searchbutton" alt="Search Site" title="Search Site"/>
			<input type="hidden" name="site" value="tsus" />
			<input type="hidden" name="output" value="xml_no_dtd" />
			<input type="hidden" name="client" value="tsus_frontend" />
			<input type="hidden" name="proxystylesheet" value="tsus_frontend" />
		</form>
	</div>
</div>
[@mainmenu textmenu=true /]

</jsp:root>
