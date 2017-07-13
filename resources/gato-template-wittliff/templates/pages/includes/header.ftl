<header>
    <div class="container flex-header">
        <a href="${cmsfn.link(homepage)}" class="homelink">The Wittliff Collections</a><!--
     --><div class="header-buttons">
            <a class="fa fa-search search-link search-button"></a>
            <a class="btn-menu">Menu</a>
        </div>
    </div>
    <div class="main-menu">
      [@mainmenu textmenu=true /]
    </div>
    <div class="search-wrapper">
      [#import "/gato-template/templates/includes/search-modal.ftl" as search]
      [@search.searchBar false true false 'txstate' 'txstate_frontend'/]
    </div>
</header>
