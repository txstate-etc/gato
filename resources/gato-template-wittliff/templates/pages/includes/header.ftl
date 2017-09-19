<header class="page-header">
  <a href="${cmsfn.link(homepage)}" class="homelink"><img src="${gf.resourcePath()}/gato-template-wittliff/images/wittliff-logo.png" alt="The Wittliff Collections Home"></a>
  <a href="http://www.txstate.edu" class="texas-state"><img src="${gf.resourcePath()}/gato-template-wittliff/images/txst-logo.svg" alt="Texas State University"></a>
  <div class="social-media">
    <button class="icon" aria-haspopup="true" aria-controls="social-media-panel" aria-expanded="false"><span>Stay Connected</span><i class="fa fa-caret-down" aria-hidden="true"></i></button>
    <div id="social-media-panel" class="social-media-panel">
      [@cms.area name="socialmedia" content=gf.getOrCreateArea(homepage, 'socialmedia') editable=false /]
      [@cms.area name="newsletter-button" content=gf.getOrCreateArea(homepage, 'newsletter-button') editable=false /]
    </div>
  </div>
  <button class="search-link search-button"><span class="visuallyhidden">Search</span><i class="fa fa-search" aria-hidden="true"></i></button>
  <div class="main-menu">
    <button class="icon" aria-haspopup="true" aria-controls="main-menu-panel" aria-expanded="false"><span>Menu</span><i class="fa fa-bars" aria-hidden="true"></i></button>
    <nav id="main-menu-panel" class="main-menu-panel" role="navigation">
      [@simplemenu arrows=true /]
      [#if gf.hasComponents(homepage['socialmedia']) || gf.hasComponents(homepage['newsletter-button']) || (isHomePage && cmsfn.isEditMode())]
      <div class="menu-social-media">
        [@cms.area name="socialmedia" content=gf.getOrCreateArea(homepage, 'socialmedia') editable=isHomePage/]
      </div>
      [/#if]
      <div class="menu-newsletter-button">
        [@cms.area name="newsletter-button" content=gf.getOrCreateArea(homepage, 'newsletter-button') editable=isHomePage /]
      </div>
      [#if gf.hasComponents(homepage['donate-button']) || (isHomePage && cmsfn.isEditMode())]
      <div class="menu-donate-button">
        [@cms.area name="donate-button" content=gf.getOrCreateArea(homepage, 'donate-button') editable=isHomePage /]
      </div>
      [/#if]
      <img src="${gf.resourcePath()}/gato-template-wittliff/images/txst-logo.svg" class="menu-txst-logo" alt="">
    </nav>
  </div>
  <div class="search-wrapper">
    [#import "/gato-template/templates/includes/search-modal.ftl" as search]
    [@search.searchBar false true true /]
  </div>
</header>
