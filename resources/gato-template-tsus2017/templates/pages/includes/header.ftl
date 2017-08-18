<header>
    <div class="container flex-header">
        <a href="${cmsfn.link(homepage)}" class="tsus-homelink">Texas State University System</a>
        <div class="header-buttons">
          <button class="search-link search-button"><span class="visuallyhidden">Search</span><i class="fa fa-search" aria-hidden="true"></i></button>
          <button class="btn-menu" aria-label="Menu - hit enter to open dialog" aria-haspopup="true" aria-expanded="false" aria-controls="tsus-main-menu">Menu</button>
          <div class="main-menu">
              [@simplemenu /]
              <nav class="main-menu-panel">
                    [@simplemenu arrows=true /]
                    <div class="menu-social-media">
                      [@cms.area name="socialmedia" content=gf.getOrCreateArea(homepage, 'socialmedia') editable=isHomePage/]
                    </div>
                    <div class="menu-tsus-button">
                        <img src="${gf.resourcePath()}/gato-template-tsus2017/images/logo.png" class="menu-txst-logo">
                    </div>
              </nav>
          </div>

        </div>
    </div>

    <div class="search-wrapper">
        [#import "/gato-template/templates/includes/search-modal.ftl" as search]
        [@search.searchBar false true false 'tsus' 'tsus_frontend'/]
    </div>
</header>
