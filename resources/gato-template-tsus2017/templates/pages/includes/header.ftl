<header class="tsuspage-header">
  <a href="${cmsfn.link(homepage)}" class="tsushome-link"><img src="${gf.resourcePath()}/gato-template-tsus2017/images/logo.png" alt="Texas State University System"></a>

  <div class="tsus-social-media">
    <button class="icon" aria-haspopup="true" aria-controls="social-media-panel" aria-expanded="false">
      <span>Stay Connected</span>
      <i class="fa fa-caret-down" aria-hidden="true"></i>
    </button>
    <div id="social-media-panel" class="social-media-panel">
      [@cms.area name="socialmedia" content=gf.getOrCreateArea(homepage, 'socialmedia') editable=false /]
    </div>
  </div>

  <button class="search-link search-button">
    <span class="visuallyhidden">Search</span>
    <i class="fa fa-search" aria-hidden="true" ></i>
  </button>

  <div class="tsusmain-menu" >
      <button class="icon" aria-haspopup="true" aria-controls="main-menu-panel" aria-expanded="false">
        <span>Menu</span>
          <i class="fa fa-bars" aria-hidden="true"></i>
      </button>

      <nav id="main-menu-panel" class="main-menu-panel" role="navigation">
            <div class="menu-social-media">
              [@cms.area name="socialmedia" content=gf.getOrCreateArea(homepage, 'socialmedia') editable=isHomePage/]
            </div>
            <div class="menu-tsus-button">
                <img src="${gf.resourcePath()}/gato-template-tsus2017/images/logo.png" class="menu-txst-logo">
            </div>
      </nav>
  </div>

  <div class="search-wrapper">
    [#import "/gato-template/templates/includes/search-modal.ftl" as search]
    [@search.searchBar false true false 'tsus' 'tsus_frontend'/]
  </div>

</header>
