<footer>
  <div class="top">
    <div class="footer-column">
      <div class="footer-page-title">
        <a href="${cmsfn.link(homepage)}">${gf.nodeTitle(homepage)}</a>
      </div>
      <div class="contact-info">
        [@cms.area name="siteinfo" content=gf.getOrCreateArea(homepage, 'siteinfo') editable=isHomePage/]
      </div>
    </div>
  </div>
  <div class="bottom">
    <div class="logo">
      Texas State University
    </div>
    <ul class="bottom-footer-links">
      [@cms.area name="footerlinks" content=gf.getOrCreateArea(homepage, 'footerlinks') editable=isHomePage/]
    </ul>
  </div>
</footer>
