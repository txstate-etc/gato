[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#if hasTallComponent(components)]
  [#assign flexDirection = 'flex-direction: column']
  [#assign maxWidth = 'max-width: 50%']
[#else]
  [#assign flexDirection = 'flex-direction: inherit']
  [#assign maxWidth = 'max-width: inherit']  
[/#if]  
<div class="gato-explore txst-explore" style="${flexDirection}">
  [#list components as component ]
    [#if component.orientation == 'wide']
      [#assign flexBasis = 'flex-basis: 100%']
    [#else]
      [#assign flexBasis = 'flex-basis: 45%']      
    [/#if]

    <div class="gato-explore-image txst-explore-image" style="${flexBasis}; ${maxWidth}">
      [@cms.component content=component /]
    </div>
  [/#list]
  [#if cmsfn.isEditMode()]
    <li class="add gato-gallery-image txst-gallery-image" cms:add="box"></li>
  [/#if]
</div>
