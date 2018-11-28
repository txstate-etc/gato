<header class="page-header">
    <div class="container flex-header">
      <a href="${cmsfn.link(homepage)}" class="tsus-homelink">Texas State University System</a>
      <button class="search-link search-button">
        <span class="visuallyhidden">Search</span>
        <i class="fa fa-search" aria-hidden="true"></i>
      </button>
      <div id="tsus-main-menu" class="main-menu">
        <button class="btn-menu" aria-label="Menu - hit enter to open dialog" aria-haspopup="true" aria-expanded="false" aria-controls="tsus-main-menu">
          Menu
          <i class="fa fa-bars" aria-hidden="true"></i>
        </button>
        <nav id="main-menu-panel" class="main-menu-panel" role="navigation">
          [@simplemenu arrows=true /]
        </nav
      </div>
    </div>
    <div class="search-wrapper">
        [#import "/gato-template/templates/includes/search-modal.ftl" as search]
        [@search.searchBar false true false /]
    </div>
</header>
