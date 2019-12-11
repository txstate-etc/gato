[#assign mypage = (cmsfn.ancestors(content)?first)!cmsfn.page(content)]
[#macro searchBar sitesearch=true isHomePage=false site='txstate_no_users' client='txstate']
  [#assign placeholder = sitesearch?string('Search this site', 'Search all of Texas State')]
  <script type="text/javascript">
    var window.gatosearchvars = {
      sitesearch: "${sitesearch}",
      isHomePage: "${isHomePage}",
      site: "${site}",
      client: "${client}"
    }
  </script>
  <div id="search-modal-content" class="hidden">
    <div class="searchbar">
      <form class="searchbar-form" action="//www.txstate.edu/search">
        <div class="searchbar-content">
          [#if sitesearch]
            <input type="hidden" id="sitesearch" name="sitesearch" value="${ctx.request.serverName}" />
          [/#if]
          <input type="hidden" id="client" name="client" value="${client}" />
          <input type="hidden" id="site" name="site" value="${site}" />
          [#nested]
          <label for="search-text" class="visuallyhidden">Search Terms</label>
          <input id="search-text" class="search" name="q" size="15" placeholder="${placeholder}" />[#--
      --]<button class="icon"><i class="fa fa-search"></i><span class="visuallyhidden">Start Search</span></button>
        </div>
        [#if !isHomePage]
          <div class="search-radios">
            <fieldset>
            <legend class="visuallyhidden">Select search scope</legend>
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
            </fieldset>
          </div>
          <button class="btn-close-search-dialog">Close Search Dialog</button>
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
              searchField.focus();
            });
          </script>
        [/#if]
      </form>
    </div>
  </div>
[/#macro]
