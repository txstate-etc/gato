<header>
    <div class="container flex-header">
        <a href="${cmsfn.link(homepage)}" class="tsus-homelink">Texas State University System</a><!--
     --><div class="header-buttons">
          <button class="search-link search-button"><span class="visuallyhidden">Search</span><i class="fa fa-search" aria-hidden="true"></i></button>
          <button class="btn-menu" aria-label="Menu - hit enter to open dialog" aria-haspopup="true" aria-expanded="false" aria-controls="tsus-main-menu">Menu</button>
        </div>
    </div>
    <div id="tsus-main-menu" class="main-menu">
    [@simplemenu /]
    </div>
    <div class="search-wrapper">
        [#import "/gato-template/templates/includes/search-modal.ftl" as search]
        [@search.searchBar false true false 'tsus' 'tsus_frontend'/]
    </div>
</header>
