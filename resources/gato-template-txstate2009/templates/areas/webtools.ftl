<div class="txst-banner-toolsandsearch" aria-haspopup="true">
	<div class="txst-banner-webtools-menuheader">
    <a href="#" id="txst-banner-webtools-dropdown">Web Tools</a>
	</div>
	<div role="menu" class="txst-banner-webtools-menuitems" id="txst-banner-webtools-menuitems">
		<div class="png-bg">
      [#assign globaldata=cmsfn.contentByPath('/global-data')]
      [#list cmsfn.children(globaldata.webTools, 'mgnl:component') as component]
        <div role="menuitem" class="txst-banner-webtools-menuitem">
          [@cms.component content=component /]
        </div>
      [/#list]
      <div class="clearboth"></div>
      [#if cmsfn.isEditMode()]
        <div role="menuitem" class="txst-banner-webtools-menuitem" cms:add="bar"></div>
      [/#if]
    </div>
  </div>
  <form action="http://search.txstate.edu/search">
    <div class="txst-banner-search">
      <label style="display: none" for="q">Search for:</label>
      <input type="text" name="q" id="q" size="15" value="Search web/people" />
      <input type="hidden" name="site" value="txstate_no_users" />
      <input type="hidden" name="client" value="txstate" />
      <input type="hidden" name="output" value="xml_no_dtd" />
      <input type="hidden" name="proxystylesheet" value="txstate" />
      <input id="webtools-search-form-sitesearch" type="hidden" name="sitesearch" value="${ctx.request.serverName}" />
    </div>
    <div class="txst-banner-webtools-searchbg"><input type="image" src="${gf.resourcePath()}/gato-template/images/x.gif"
        class="txst-banner-toolssearchbutton" alt="Start Search"/></div>
  </form>
</div>
