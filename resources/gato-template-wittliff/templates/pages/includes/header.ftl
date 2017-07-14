<header class="page-header">
  <a href="${cmsfn.link(homepage)}" class="homelink"><img src="" alt="">The Wittliff Collections</a>
  <a href="http://www.txstate.edu" class="texas-state"><img src="" alt="Texas State University"></a>
  <div class="social-media">
    <button class="icon"><span>Stay Connected</span><i class="fa fa-chevron-down" aria-hidden="true"></i></button>
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
