<footer>
  <div class="top">
    <div class="footer-column contact">
      <div class="footer-column-content">
        <div class="footer-page-title">
          <a href="${cmsfn.link(homepage)}">${gf.nodeTitle(homepage)}</a>
        </div>
        <div class="contact-info">
          [@cms.area name="siteinfo" content=gf.getOrCreateArea(homepage, 'siteinfo') editable=isHomePage/]
        </div>
      </div>
    </div>
    <div class="footer-column">
      <div class="footer-column-content">
        <div class="footer-column-title">Resources</div>
        <ul class="resources">
        [@cms.area name="resources" content=gf.getOrCreateArea(homepage, 'resources') editable=isHomePage/]
        </ul>
      </div>
    </div>
    <div class="footer-column">
      <div class="footer-column-content">
        <div class="footer-column-title">Connect</div>
        <div class="connect-links">
          [@cms.area name="socialmedia" content=gf.getOrCreateArea(homepage, "socialmedia") editable=isHomePage/]
          <ul class="connect">
          [@cms.area name="connect" content=gf.getOrCreateArea(homepage, 'connect') editable=isHomePage/]
          </ul>
        </div>
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
