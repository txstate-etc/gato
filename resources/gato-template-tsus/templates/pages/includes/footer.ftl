<div class="tsus-link-footer-bg">
  <div class="tsus-link-footer">
    <ul class="tsus-footer-block tsus-footer-subpages">
      [#list cmsfn.children(homepage, 'mgnl:page') as childPage]
        [#if !(childPage.hideInNav!false)]
          <li><a href="${cmsfn.link(childPage)}">${gf.nodeTitle(childPage)}</a></li>
        [/#if]
      [/#list]
    </ul>
    <ul class="tsus-footer-block tsus-footer-menulinks">
      [@cms.area name="menulinks" content=gf.getOrCreateArea(homepage, 'menulinks') editable=false /]
    </ul>
    <ul class="tsus-footer-block">
      [@cms.area name="footerlinks1" content=gf.getOrCreateArea(homepage, 'footerlinks1') editable=isHomePage /]
    </ul>
    <ul class="tsus-footer-block">
      [@cms.area name="footerlinks2" content=gf.getOrCreateArea(homepage, 'footerlinks2') editable=isHomePage /]
    </ul>
  </div>
</div>

<div class="tsus-footer-bg">
  <div class="tsus-footer">
    [@cms.area name="footer" content=gf.getOrCreateArea(homepage, 'footer') editable=isHomePage /]
  </div>
</div>
