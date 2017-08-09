<footer>

<div class="footer-column">
	[@cms.area name="footer-findus" content=gf.getOrCreateArea(homepage, 'footer-findus') editable=isHomePage/]
</div>

<div class="footer-column">
	[@cms.area name="footer-hours" content=gf.getOrCreateArea(homepage, 'footer-hours') editable=isHomePage/]

	<a href="http://www.txstate.edu" class="texas-state"><img src="${gf.resourcePath()}/gato-template-wittliff/images/txst-logo-black-color.svg" alt="Texas State University"></a>
</div>

<div class="footer-column-links">
	<ul class="footer-links">
		[@cms.area name="footerlinks1" content=gf.getOrCreateArea(homepage, 'footerlinks1') editable=isHomePage/]
	</ul>

	[@cms.area name="socialmedia" content=gf.getOrCreateArea(homepage, 'socialmedia') editable=false /]
</div>
</footer>
