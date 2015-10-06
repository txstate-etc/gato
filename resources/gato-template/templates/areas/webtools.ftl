<div class="gato-webtools">
	<a href="#" class="gato-webtools-dropdown">Web Tools</a>
	<div class="gato-webtools-items">
    [#assign globaldata=cmsfn.contentByPath('/global-data')]
    [#list cmsfn.children(globaldata.webTools, 'mgnl:component') as component]
      <div class="gato-webtools-item">
        [@cms.component content=component /]
      </div>
    [/#list]
	</div>
</div>
