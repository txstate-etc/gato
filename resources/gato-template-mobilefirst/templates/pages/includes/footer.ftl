<footer>
  <div class="top">
    <div class="footer-column contact">
      <div class="footer-contact-column-content">
        <h2 class="footer-page-title">
          <a href="${cmsfn.link(homepage)}">${gf.nodeTitle(homepage)}</a>
        </h2>
        <div class="contact-info">
          [@cms.area name="siteinfo" content=gf.getOrCreateArea(homepage, 'siteinfo') editable=isHomePage/]
        </div>
      </div>
    </div>
    <div class="footer-column">
      <div class="footer-column-content">
        <h2 class="footer-column-title">Resources</h2>
        <a href="#" class="mobile-footer-column-title" aria-haspopup="true" aria-expanded="false" aria-controls="resource-links">Resources</a>
        <ul id="resource-links" class="resources footer-column-link-list">
        [#assign resources = gf.getOrCreateArea(homepage, 'gato-footer-resources')]
        [#if !gf.hasComponents(resources)]
          [#list cmsfn.children(globalLinks.mobileFirstResources, "mgnl:component") as component]
            <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
          [/#list]
        [/#if]
        [@cms.area name="gato-footer-resources" content=gf.getOrCreateArea(homepage, 'gato-footer-resources') editable=isHomePage/]
        </ul>
      </div>
    </div>
    <div class="footer-column">
      <div class="footer-column-content">
        <h2 class="footer-column-title">Connect</h2>
        [#assign connections = gf.getOrCreateArea(homepage, 'connect')]
        [#assign hasConnections = gf.hasComponents(connections)]
        <a href="#" class="mobile-footer-column-title ${hasConnections?then('', 'empty')}" aria-haspopup="true" aria-expanded="false" aria-controls="connect-links">Connect</a>
        <div class="connect-links">
          <div class="social-media-container">
            [@cms.area name="socialmedia" content=gf.getOrCreateArea(homepage, "socialmedia") editable=isHomePage contextAttributes={"shownotice":isHomePage}/]
          </div>
          <ul id="connect-links" class="connect footer-column-link-list ${hasConnections?then('', 'empty')}">
          [@cms.area name="connect" content=gf.getOrCreateArea(homepage, 'connect') editable=isHomePage/]
          </ul>
        </div>
      </div>
    </div>
    <div class="social-media-container mobile">
      [@cms.area name="socialmedia" content=gf.getOrCreateArea(homepage, "socialmedia") editable=isHomePage contextAttributes={"shownotice":isHomePage}/]
    </div>
  </div>
  <div class="bottom">
    <div class="logo">
    <a href="http://www.txstate.edu">
      <img src="${ctx.contextPath}/.resources/gato-template-mobilefirst/images/txst-footer-logo.svg" alt="Texas State University" />
    </a>
    </div>
    <ul class="bottom-footer-links">
    [#list cmsfn.children(globalLinks.mobileFirstFooter, "mgnl:component") as component]
      <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
    [/#list]
    </ul>
  </div>
</footer>
