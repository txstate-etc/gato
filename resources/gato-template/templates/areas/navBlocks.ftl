[#macro listnav position]
  [#list cmsfn.ancestors(cmsfn.page(content)) as page]
    [#if page.navBlocks??]
      [#list cmsfn.children(page.navBlocks, 'mgnl:component') as sidenav]
        [#if (sidenav.inherit!false) && sidenav.position! == position]
          [@cms.component content=sidenav editable=false contextAttributes={ "inheritedfrom" : page }/]
        [/#if]
      [/#list]
    [/#if]
  [/#list]
[/#macro]

[@listnav position='top' /]
[#list components as component]
  [#if component.position == 'top']
    [@cms.component content=component /]
  [/#if]
[/#list]
[#list components as component]
  [#if component.position == 'bottom']
  [@cms.component content=component /]
  [/#if]
[/#list]
[#if cmsfn.isEditMode()]
  <div class="navBlocks_add" cms:add="box"></div>
[/#if]
[@listnav position='bottom' /]
