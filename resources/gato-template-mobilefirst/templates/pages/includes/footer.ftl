<footer>
  <div class="top">
    <div class="footer-column contact">
      <div class="footer-contact-column-content">
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
        <a href="#resource-links" class="footer-column-title" aria-haspopup="true" aria-expanded="false" aria-controls="resource-links">Resources</a>
        <ul id="resource-links" class="resources footer-column-link-list">
        [@cms.area name="resources" content=gf.getOrCreateArea(homepage, 'resources') editable=isHomePage/]
        </ul>
      </div>
    </div>
    <div class="footer-column">
      <div class="footer-column-content">
        <a href="#connect-links" class="footer-column-title" aria-haspopup="true" aria-expanded="false" aria-controls="connect-links">Connect</a>
        <div class="connect-links">
          <div class="social-media-container">
            [@cms.area name="socialmedia" content=gf.getOrCreateArea(homepage, "socialmedia") editable=isHomePage/]
          </div>
          <ul id="connect-links" class="connect footer-column-link-list">
          [@cms.area name="connect" content=gf.getOrCreateArea(homepage, 'connect') editable=isHomePage/]
          </ul>
        </div>
      </div>
    </div>
    <div class="social-media-container mobile">
      [@cms.area name="socialmedia" content=gf.getOrCreateArea(homepage, "socialmedia") editable=isHomePage/]
    </div>
  </div>
  <div class="bottom">
    <div class="logo">
    <a href="http://www.txstate.edu">
      <img src="${ctx.contextPath}/.resources/gato-template-mobilefirst/images/txstate_h_1e_secondary_white_rgb.png" alt="Texas State University" />
    </a>
    </div>
    <ul class="bottom-footer-links">
      [@cms.area name="footerlinks" content=gf.getOrCreateArea(homepage, 'footerlinks') editable=isHomePage/]
    </ul>
  </div>
</footer>
