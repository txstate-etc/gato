<nav class="gato-webtools" aria-haspopup="true">
  <a href="#" class="gato-webtools-dropdown">Web Tools</a>
  <div role="menu" class="gato-webtools-items">
    [#assign globaldata=cmsfn.contentByPath('/global-data')]
    [#list cmsfn.children(globaldata.webTools, 'mgnl:component') as component]
      <div role="menuitem" class="gato-webtools-item">
        [@cms.component content=component /]
      </div>
    [/#list]
    [#if cmsfn.isEditMode()]
      <div role="menuitem" class="gato-webtools-item" cms:add="bar"></div>
    [/#if]
  </div>
</nav>
