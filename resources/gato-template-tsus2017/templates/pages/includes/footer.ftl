<footer>
    <div class="contact-info">
        <div class="container footer-container">
            <div class="contact-container">
                [@cms.area name="contact-information" content=gf.getOrCreateArea(homepage, 'contact-information') editable=isHomePage /]
            </div>
            <div class="social-media">
                    [@cms.area name="socialmedia" content=gf.getOrCreateArea(homepage, 'socialmedia') editable=isHomePage contextAttributes={"icononly": true} /]
            </div>
        </div>
    </div>
    <div class="link-footer">
        <div class="container">
            <div class="top">
                <div class="copyright">
                    <a class="footer-logo">The Texas State University System</a>
                    <div>©2017 The Texas State University System All Rights Reserved.</div>
                </div>
                <ul class="links">
                    [@cms.area name="footerlinks1" content=gf.getOrCreateArea(homepage, 'footerlinks1') editable=isHomePage /]
                </ul>
            </div>
            <div class="bottom">
                [@cms.area name="footerlinks2" content=gf.getOrCreateArea(homepage, 'footerlinks2') editable=isHomePage /]
            </div>
        </div>
    </div>
</footer>
