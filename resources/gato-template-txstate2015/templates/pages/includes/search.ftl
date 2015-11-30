[#macro searchBar isMobile sitesearch=true]
  [#assign searchClass = isMobile?string('txst_mobile_search', 'txst_search')]
  [#assign mobileSearchBar = isMobile?string('mobile_search_bar', '')]
  [#assign mobileSearch = isMobile?string('mobile_search', '')]
  [#assign mobileIcon = isMobile?string('mobile_icon', '')]
  [#assign placeholder = sitesearch?string('Search this site', 'Search people and pages')]
  <form action="http://search.txstate.edu/search" class="gato-search ${searchClass}">
    <div class="search_bar ${mobileSearchBar}">
      <input type="hidden" name="site" value="txstate_no_users" />
      <input type="hidden" name="client" value="txstate" />
      <input type="hidden" name="output" value="xml_no_dtd" />
      <input type="hidden" name="proxystylesheet" value="txstate" />
      [#if sitesearch]
        <input type="hidden" name="sitesearch" value="${ctx.request.serverName}" />
      [/#if]
      [#nested]
      <input type="search" class="search ${mobileSearch}" name="q" size="15" placeholder="${placeholder}" aria-label="Search" />[#--
      --]<button class="icon ${mobileIcon}"><i class="fa fa-search" aria-label="Start Search"></i></button>
    </div>
  </form>
[/#macro]
