<header id="header">
  [@skipnav/]
  [#if !sectionIsHomePage]
    <div id="logo">
      <a href="${cmsfn.link(homepage)}" title="${gf.nodeTitle(homepage)}">${gf.nodeTitle(homepage)}</a>
    </div>
  [/#if]
  <div id="sectiontitle">
    <a href="${cmsfn.link(sectionHomePage)}">${gf.nodeTitle(sectionHomePage)}</a>
  </div>
  <nav id="mainnav">
    <ul>
      [@navloop cmsfn.children(sectionHomePage, 'mgnl:page') ; page]
        <li class="submenu">
          <a href="${cmsfn.link(page)}" class="top">${gf.nodeTitle(page)}</a>
          [#if gf.hasNavChildren(page)]
            <ul>
              [@navloop cmsfn.children(page, 'mgnl:page') ; subpage]
                <li class="item"><a href="${cmsfn.link(subpage)}">${gf.nodeTitle(subpage)}</a></li>
              [/@navloop]
            </ul>
          [/#if]
        </li>
      [/@navloop]
    </ul>
  </nav>
</header>
