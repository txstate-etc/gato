[#assign mypage = cmsfn.page(content)]
[#macro searchBar isMobile sitesearch=true isHomePage=false]
  [#assign searchClass = isMobile?string('txst_mobile_search', 'txst_search')]
  [#assign mobileSearchBar = isMobile?string('mobile_search_bar', '')]
  [#assign mobileSearch = isMobile?string('mobile_search', '')]
  [#assign mobileIcon = isMobile?string('mobile_icon', '')]
  [#assign placeholder = sitesearch?string('Search this site', 'Search all of Texas State')]

  <div id="search-modal-content" class="hidden">
    <div class="searchbar">
      <form class="searchbar-form" action="http://search.txstate.edu/search">
        <div class="searchbar-content">
          [#if sitesearch]
            <input type="hidden" id="sitesearch" name="sitesearch" value="${ctx.request.serverName}" />
          [/#if]
          [#nested]
          <input id="search-text" class="search ${mobileSearch}" autofocus="autofocus" name="q" size="15" placeholder="${placeholder}" />[#--
      --]<button class="icon ${mobileIcon}"><i class="fa fa-search" aria-label="Start Search"></i></button>
        </div>
        [#if !isHomePage]
        <div class="search-radios">
          <span>
            <label for="this-site" aria-label="search only in this site: ${gf.nodeTitle(mypage)}">
              <input checked="checked" name="txst-search" value="This Site" id="this-site" type="radio">
              This Site
            </label>
          </span>
          <span>
            <label for="txst-all" aria-label="search all Texas State web sites">
              <input name="txst-search" value="All Texas State" id="txst-all" type="radio">
              All Texas State
            </label>
          </span>
        </div>
        <script>
          jQuery( "input[name=txst-search]:radio" ).on('change', function(e){
            var searchField = jQuery('#search-text');
            var sitesearchfield = jQuery('input[name=sitesearch]');
            if(e.target.id == "this-site"){
              searchField.attr('placeholder', 'Search this site');
              if(sitesearchfield.length < 1){
                jQuery('.searchbar-form').append('<input type="hidden" id="sitesearch" name="sitesearch" value="${ctx.request.serverName}" />');
              }
            }
            else{
              searchField.attr('placeholder', 'Search all of Texas State');
              sitesearchfield.remove();
            }
          });
        </script>
        [/#if]
        <div>
        </div>
      </form>
    </div>
  </div>
[/#macro]
