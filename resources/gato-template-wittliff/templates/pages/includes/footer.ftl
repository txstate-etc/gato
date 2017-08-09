<footer>

<div class="footer-column">
	[@cms.area name="footer-findus" content=gf.getOrCreateArea(homepage, 'footer-findus') editable=isHomePage/]
</div>

<div class="footer-column">
	[@cms.area name="footer-hours" content=gf.getOrCreateArea(homepage, 'footer-hours') editable=isHomePage/]

	<a href="http://www.txstate.edu" class="texas-state"><img src="${gf.resourcePath()}/gato-template-wittliff/images/txst-logo-black-color.svg" alt="Texas State University"></a>
</div>

<div class="footer-column footer-column-links">
	<ul class="footer-links">
		<li><a href="#">About</a></li>
		<li><a href="#">Donate to the Wittliff</a></li>
		<li><a href="#">Shop</a></li>
		<li><a href="#">News</a></li>
		<li><a href="#">Facility Use Policy</a></li>
		<li><a href="#">Contact Us</a></li>
	</ul>

	[@cms.area name="socialmedia" content=gf.getOrCreateArea(homepage, 'socialmedia') editable=false /]
</div>
</footer>
