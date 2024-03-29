[#macro gatonavigationdata page depth]
  {
    title: "${gf.nodeTitle(page)?json_string}",
    path: "${page['@path']}",
    href: "${cmsfn.link(page)}",
    depth: "${depth}",
    children: [
      [#local first = true]
      [@navloop cmsfn.children(page, 'mgnl:page') ; subpage]
        [#if !first],[/#if]
        [#local first = false]
        [@gatonavigationdata subpage depth+1/]
      [/@navloop]
    ]
  }
[/#macro]

[#macro gatonavigationhtml page homepage]
  [#local isHome = !cmsfn.parent(page)?has_content]
  <div class="navigation-up">
    [#if isHome]
      <a class="home" href="//www.txst.edu">
        <i class="fa fa-home arrow" aria-hidden="true"></i>
        <span>Home</span>
      </a>
    [#else]
      [#local parent = cmsfn.parent(page)]
      <a class="back" href="${cmsfn.link(parent)}" data-path="${parent['@path']}">
        <i class="fa fa-angle-left arrow" aria-hidden="true"></i>
        <span>Back</span>
      </a>
      <a class="top" href="${cmsfn.link(homepage)}" data-path="${homepage['@path']}">
        <i class="fa fa-angle-left arrow" aria-hidden="true"></i><i class="fa fa-angle-left arrow" aria-hidden="true"></i>
        <span>Main Menu</span>
      </a>
    [/#if]
  </div>
  <a class="navigation-root" href="${cmsfn.link(homepage)}">${gf.nodeTitle(homepage)}</a>
  <div class="menu-dynamic-navigation">
    <div class="slide">
      <div class="navigation-tree">
        [#if !isHome]
          <a class="navigation-current" href="${cmsfn.link(page)}">${gf.nodeTitle(page)}</a>
        [/#if]
        <ul class="navigation-children">
        [@navloopmax cmsfn.children(page, 'mgnl:page') 8 ; subpage]
          <li class="${navfn.isActive(content, subpage)?then("current-page", "")}">
            <a href="${cmsfn.link(subpage)}" data-path="${subpage['@path']}" data-depth="${subpage['@depth']}">
              [#if gf.hasNavChildren(subpage) && subpage['@depth'] < 5]
                [#assign words = gf.nodeTitle(subpage)?word_list]
                [#list words as word]
                  [#if !word?is_last]
                    ${word + ' '}
                  [#else]
                    <span class='last-word'>${word}<i class="fa fa-angle-right arrow" aria-hidden="true"></i></span>
                  [/#if]
                [/#list]
              [#else]
                ${gf.nodeTitle(subpage)}
              [/#if]
            </a>
          </li>
        [/@navloopmax]
        </ul>
      </div>
    </div>
  </div>
  <div class="menu-static-navigation">
    [@cms.area name="menulinks" content=gf.getOrCreateArea(homepage, 'menulinks') editable=false/]
    <ul class="super-list columns first">
      [#list cmsfn.children(globalLinks.superGroup2, "mgnl:component") as component]
        <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
      [/#list]
    </ul>
    <ul class="super-list columns second">
      [#list cmsfn.children(globalLinks.superGroup1, "mgnl:component") as component]
        <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
      [/#list]
    </ul>
  </div>
[/#macro]

<script type="text/javascript">[@compress single_line=true]
  var gatonavigationdata = [@gatonavigationdata homepage 1/]
[/@compress]</script>
<nav id="main-menu" class="main-menu" role="navigation" aria-expanded="false">
  <div class="menu-content">
    [#if page['@depth'] < 4 && (gf.hasNavChildren(page) || isHomePage)]
      [@gatonavigationhtml page homepage/]
    [#else]
      [@gatonavigationhtml cmsfn.parent(page) homepage/]
    [/#if]
  </div>
</nav>
