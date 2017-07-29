<header class="page-header">
  <a href="${cmsfn.link(homepage)}" class="homelink"><img src="${gf.resourcePath()}/gato-template-wittliff/images/wittliff-logo.png" alt="The Wittliff Collections Home"></a>
  <a href="http://www.txstate.edu" class="texas-state"><img src="${gf.resourcePath()}/gato-template-wittliff/images/txst-logo.svg" alt="Texas State University"></a>
  <div class="social-media">
    <button class="icon"><span>Stay Connected</span><i class="fa fa-caret-down" aria-hidden="true"></i></button>
    <div class="social-media-panel">
      [@cms.area name="socialmedia" content=gf.getOrCreateArea(homepage, 'socialmedia') editable=isHomePage /]
      [@cms.area name="newsletter" content=gf.getOrCreateArea(homepage, 'newsletter') editable=isHomePage /]
    </div>
  </div>
  <button class="start-search icon"><span class="visuallyhidden">Search</span><i class="fa fa-search" aria-hidden="true"></i></button>
  <div class="main-menu">
    <button class="icon"><span>Menu</span><i class="fa fa-bars" aria-hidden="true"></i></button>
    <nav class="main-menu-panel" role="navigation">
      [@simplemenu /]
      <div class="menu-social-media">
        [@cms.area name="socialmedia" content=gf.getOrCreateArea(homepage, 'socialmedia') editable=false/]
        [@cms.area name="newsletter" content=gf.getOrCreateArea(homepage, 'newsletter') editable=false /]
      </div>
    </nav>
  </div>
</header>
