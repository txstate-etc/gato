<form action="http://search.txstate.edu/search" class="gato-search">
  <input type="hidden" name="site" value="txstate_no_users" />
  <input type="hidden" name="client" value="txstate" />
  <input type="hidden" name="output" value="xml_no_dtd" />
  <input type="hidden" name="proxystylesheet" value="txstate" />
  [#if !isHomePage]
    <input id="gato-sitesearch" type="hidden" name="sitesearch" value="" />
    <script type="text/javascript">
      var site = window.location.host + "${cmsfn.link(homepage)}/";
      $('gato-sitesearch').value = site.slice(0,-1).replace( /\/+$/g, "" );
    </script>
  [/#if]

  <input type="text" class="gato-search-query" name="q" id="q" size="15" placeholder="Search web/people" aria-label="Search" />
  <input type="image" src="${gf.resourcePath()}/gato-template-txstate2009/images/webtools-magnify.png"
      class="gato-search-submit" alt="Start Search"/>
</form>
