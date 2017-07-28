<header>
    <div class="container flex-header">
        <a href="${cmsfn.link(homepage)}" class="tsus-homelink">Texas State University System</a><!--
     --><div class="header-buttons">
            <button class="fa fa-search search-link search-button" aria-label="Start Search - hit enter to open dialog"></button>
            <button class="btn-menu" aria-label="Menu - hit enter to open dialog">Menu</button>
        </div>
    </div>
    <div class="main-menu">
    [@simplemenu /]
    </div>
    <div class="search-wrapper">
        [#import "/gato-template/templates/includes/search-modal.ftl" as search]
        [@search.searchBar false true false 'tsus' 'tsus_frontend'/]
    </div>
</header>
