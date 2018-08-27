[#macro gatonavigationdata page]
  {
    title: "${gf.nodeTitle(page)?json_string}",
    path: "${page['@path']}",
    href: "${cmsfn.link(page)}",
    children: [
      [@navloop cmsfn.children(page, 'mgnl:page') ; subpage]
        [@gatonavigationdata subpage /]
      [/@navloop]
    ]
  }
[/#macro]

<script type="text/javascript">[@compress single_line=true]
  var gatonavigationdata = [@gatonavigationdata page /]
[/@compress]</script>
<nav id="main-menu" class="main-menu" role="navigation" aria-expanded="false">
  <div class="menu-content">
    <div class="menu-dynamic-navigation">
      <div class="slide">
        [#if !isHomePage]
        <div class="navigation-up">
        <a class="back" href="${cmsfn.link(cmsfn.parent(page))}" data-path="${page['@path']}">
          <i class="fa fa-angle-left arrow" aria-hidden="true"></i>
          <span>Back</span>
        </a>
        <a class="top" href="${cmsfn.link(homepage)}" data-path="${homepage['@path']}">
          <i class="fa fa-angle-double-left arrow" aria-hidden="true"></i>
          <span>Main Menu</span>
        </a>
        </div>
        [/#if]
        <div class="navigation-tree">
          <a class="navigation-current" href="${cmsfn.link(page)}">${gf.nodeTitle(page)}</a>
          <ul class="navigation-children">
          [@navloop cmsfn.children(page, 'mgnl:page') ; subpage]
            <li><a href="${cmsfn.link(subpage)}" data-path="${subpage['@path']}">${gf.nodeTitle(subpage)}[#if gf.hasNavChildren(subpage)]<i class="fa fa-angle-right arrow" aria-hidden="true"></i>[/#if]</a></li>
          [/@navloop]
          </ul>
        </div>
      </div>
    </div>
    <div class="menu-static-navigation">
      [@cms.area name="menulinks" content=gf.getOrCreateArea(homepage, 'menulinks') editable=false/]
      <ul class="super-list columns first">
        [#list cmsfn.children(globalLinks.superGroup1, "mgnl:component") as component]
          <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
        [/#list]
      </ul>
      <ul class="super-list columns second">
        [#list cmsfn.children(globalLinks.superGroup2, "mgnl:component") as component]
          <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
        [/#list]
      </ul>
      <a href="#" class="more-tools" aria-expanded="false">
        ${globalLinks.superGroup3.text!'Online Services'}
        <i class="fa fa-angle-down"></i>
      </a>
      <ul class="super-list more-tools">
        [#list cmsfn.children(globalLinks.superGroup3, "mgnl:component") as component]
          <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
        [/#list]
      </ul>
    </div>
  </div>
</nav>
