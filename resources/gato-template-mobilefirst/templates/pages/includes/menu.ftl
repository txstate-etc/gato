<nav id="main-menu" class="main-menu" role="navigation" aria-expanded="false">
  <div class="menu-content">
    [#if !isHomePage]
    <div class="navigation-up">
    <a class="back" href="${cmsfn.link(cmsfn.parent(page))}#navopen">
      <i class="fa fa-angle-left arrow" aria-hidden="true"></i>
      <span>Back</span>
    </a>
    <a class="top" href="${cmsfn.link(homepage)}">
      <i class="fa fa-angle-double-left arrow" aria-hidden="true"></i>
      <span>Main Menu</span>
    </a>
    </div>
    [/#if]
    <a class="navigation-current" href="${cmsfn.link(page)}">${gf.nodeTitle(page)}</a>
    <ul class="navigation-children">
    [@navloop cmsfn.children(page, 'mgnl:page') ; subpage]
      <li><a href="${cmsfn.link(subpage)}">${gf.nodeTitle(subpage)}[#if gf.hasNavChildren(subpage)]<i class="fa fa-angle-right arrow" aria-hidden="true"></i>[/#if]</a></li>
    [/@navloop]
    </ul>
    [@cms.area name="menulinks" content=gf.getOrCreateArea(homepage, 'menulinks') editable=false/]
    <ul class="super-list columns">
      [#list cmsfn.children(globalLinks.superGroup1, "mgnl:component") as component]
        <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
      [/#list]
    </ul>
    <ul class="super-list columns">
      [#list cmsfn.children(globalLinks.superGroup2, "mgnl:component") as component]
        <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
      [/#list]
    </ul>
    <a href="#" class="more-tools">
      ${globalLinks.superGroup3.text!'Online Services'}
      <i class="fa fa-caret-down"></i>
    </a>
    <ul class="super-list more-tools">
      [#list cmsfn.children(globalLinks.superGroup3, "mgnl:component") as component]
        <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
      [/#list]
    </ul>
  </div>
</nav>
