<nav id="main-menu" class="main-menu" role="navigation" aria-expanded="false">
  <div class="menu-content">
    [#if !isHomePage]
    <div class="navigation-up">
    <a class="back" href="${cmsfn.link(cmsfn.parent(page))}#navopen">
      <i class="fa fa-angle-left" aria-hidden="true"></i>
      <span>Back</span>
    </a>
    <a class="top" href="${cmsfn.link(homepage)}">
      <i class="fa fa-angle-double-left" aria-hidden="true"></i>
      <span>Main Menu</span>
    </a>
    </div>
    [/#if]
    <a class="navigation-current" href="${cmsfn.link(page)}">${gf.nodeTitle(page)}</a>
    <ul class="navigation-children">
    [@navloop cmsfn.children(page, 'mgnl:page') ; subpage]
      <li><a href="${cmsfn.link(subpage)}">${gf.nodeTitle(subpage)}</a></li>
    [/@navloop]
    </ul>
    [@cms.area name="menulinks" content=gf.getOrCreateArea(homepage, 'menulinks') editable=false/]
  </div>
</nav>
