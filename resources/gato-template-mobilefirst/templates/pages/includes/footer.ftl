[#assign leftLinksHeader = gf.getOrCreateArea(homepage, 'left-footer-links-header')]
[#assign rightLinksHeader = gf.getOrCreateArea(homepage, 'right-footer-links-header')]
[#assign leftLinksHaveHeader = gf.hasComponents(leftLinksHeader)]
[#assign rightLinksHaveHeader = gf.hasComponents(rightLinksHeader)]
<footer>
  <div class="top">
    <div class="top-footer-content">
      <div class="footer-column contact left">
        <div class="footer-contact-column-content">
          [#if isTXSTHome!false]
            <a href="http://www.txstate.edu">
              <img class="txst-logo" src="${ctx.contextPath}/.resources/gato-template-mobilefirst/images/txst-footer-logo.svg" alt="Texas State University" />
            </a>
          [#else]
            <h2 class="footer-page-title">
              <a href="${cmsfn.link(homepage)}">${gf.nodeTitle(homepage)}</a>
            </h2>
          [/#if]
          <div class="contact-info">
            [@cms.area name="siteinfo" content=gf.getOrCreateArea(homepage, 'siteinfo') editable=isHomePage/]
          </div>
          [#assign sitemappath = cmsfn.asJCRNode(homepage).path + "/sitemap"]
          [#if cmsfn.contentByPath(sitemappath)??]
            <div class="site-map-link">
              <a href="${cmsfn.link(cmsfn.contentByPath(sitemappath))}">Site Map</a>
            </div>
          [/#if]
          <div class="social-media-container">
            [@cms.area name="socialmedia" content=gf.getOrCreateArea(homepage, "socialmedia") editable=isHomePage contextAttributes={"shownotice":isHomePage}/]
          </div>
        </div>
      </div>
      <div class="footer-column center">
        <div class="footer-column-content">
          <h2 class="footer-column-title">
          [@cms.area name="left-footer-links-header" content=leftLinksHeader editable=isHomePage/]
          [#if !leftLinksHaveHeader]
            Resources
          [/#if]
          </h2>
          <a href="#" class="mobile-footer-column-title" aria-haspopup="true" aria-expanded="false" aria-controls="resource-links">
          [#if !leftLinksHaveHeader]
            Resources
          [#else]
            [@cms.area name="left-footer-links-header" content=leftLinksHeader editable=false/]
          [/#if]
          </a>
          <ul id="resource-links" class="resources footer-column-link-list">
          [#assign resources = gf.getOrCreateArea(homepage, 'gato-footer-resources')]
          [#if !gf.hasComponents(resources)]
            [#list cmsfn.children(globalLinks.mobileFirstResources, "mgnl:component") as component]
              <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
            [/#list]
          [/#if]
          [@cms.area name="gato-footer-resources" content=gf.getOrCreateArea(homepage, 'gato-footer-resources') editable=isHomePage/]
          [#if !rightLinksHaveHeader]
            [#assign rightLinks = gf.getOrCreateArea(homepage, 'connect')]
            [#list cmsfn.children(rightLinks) as rightLink]
              <li class="right-link"><a href="${gf.filterUrl(rightLink.link)}">${gf.filterLinkTitle(rightLink.text, rightLink.link)}</a></li>
            [/#list]
          [/#if]
          </ul>
        </div>
      </div>
      <div class="footer-column right ${rightLinksHaveHeader?then('', 'empty')}">
        <div class="footer-column-content">
          [#if rightLinksHaveHeader]<h2 class="footer-column-title">[#else]<div class="add-links-title">[/#if]
          [@cms.area name="right-footer-links-header" content=rightLinksHeader editable=isHomePage/]
          [#if rightLinksHaveHeader]</h2>[#else]</div>[/#if]
          [#assign connections = gf.getOrCreateArea(homepage, 'connect')]
          [#assign hasConnections = gf.hasComponents(connections)]
          [#if rightLinksHaveHeader]<a href="#" class="mobile-footer-column-title ${hasConnections?then('', 'empty')}" aria-haspopup="true" aria-expanded="false" aria-controls="connect-links">[/#if]
          [@cms.area name="right-footer-links-header" content=rightLinksHeader editable=false/]
          [#if rightLinksHaveHeader]</a>[/#if]
          <div class="connect-links [#if !rightLinksHaveHeader]no-header[/#if]" >
            <ul id="connect-links" class="connect footer-column-link-list ${hasConnections?then('', 'empty')}">
            [@cms.area name="connect" content=gf.getOrCreateArea(homepage, 'connect') editable=isHomePage/]
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="bottom">
    <div class="bottom-footer-content">
      [#if !isTXSTHome!false]
        <div class="logo">
        <a href="http://www.txstate.edu">
          <img src="${ctx.contextPath}/.resources/gato-template-mobilefirst/images/txst-footer-logo.svg" alt="Texas State University" />
        </a>
        </div>
      [#else]
        <a href="https://www.tsus.edu">
          <img class="tsus-logo" src="${ctx.contextPath}/.resources/gato-template-mobilefirst/images/tsus-logo-horizontal.svg" alt="Texas State University System" />
        </a>
      [/#if]
      <ul class="bottom-footer-links">
      [#list cmsfn.children(globalLinks.mobileFirstFooter, "mgnl:component") as component]
        <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
      [/#list]
      </ul>
    </div>
  </div>
</footer>
