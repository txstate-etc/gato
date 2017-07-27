<header class="page-header">
  <a href="${cmsfn.link(homepage)}" class="homelink"><img src="${gf.resourcePath()}/gato-template-wittliff/images/wittliff-logo.png" alt="The Wittliff Collections Home"></a>
  <a href="http://www.txstate.edu" class="texas-state"><img src="${gf.resourcePath()}/gato-template-txstate2015/images/txst_logo.svg" alt="Texas State University"></a>
  <div class="social-media">
    <button class="icon"><span>Stay Connected</span><i class="fa fa-caret-down" aria-hidden="true"></i></button>
    [@cms.area name="socialmedia" content=gf.getOrCreateArea(homepage, 'socialmedia') editable=isHomePage /]
  </div>
  <button class="start-search icon"><span class="visuallyhidden">Search</span><i class="fa fa-search" aria-hidden="true"></i></button>
  <div class="main-menu">
    <button class="icon"><span>Menu</span><i class="fa fa-bars" aria-hidden="true"></i></button>
    <nav class="main-menu-panel" role="navigation">
      [@simplemenu /]
      [@cms.area name="socialmedia" content=gf.getOrCreateArea(homepage, 'socialmedia') editable=false/]
    </nav>
  </div>
</header>
