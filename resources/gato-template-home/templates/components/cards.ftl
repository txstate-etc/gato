[#include "/gato-template/templates/includes/commonmacros.ftl"]

[#if hasTallComponent(components)]
  [#assign flexDirection = 'flex-direction: column']
  [#assign maxWidth = 'max-width: 50%']
[#else]
  [#assign flexDirection = 'flex-direction: inherit']
  [#assign maxWidth = 'max-width: inherit']  
[/#if]  
[#if cmsfn.isEditMode() && ctx.barsonly!false]
  <div class="bars">
    [#list components as component]
      [@cms.component content=component contextAttributes={"barsonly": true} /]
    [/#list]
    <div class="${(components?size < 4)?string('feature_add','feature_max')}" data-title="test"cms:add="bar"></div>
  </div>  
[/#if]

[#if !(ctx.barsonly!false)]
<div class="gato-explore" style="${flexDirection}">
  [#list components as component ]
    [#if component.orientation == 'wide']
      [#assign flexBasis = 'flex-basis: 100%']
    [#else]
      [#assign flexBasis = 'flex-basis: 45%']      
    [/#if]
    [#if component.orientation == 'tall']
      [#assign flexBasis = 'flex-basis: 100%']
      [#assign maxHeight = 'max-height: 100%']
    [#else]
      [#assign flexBasis = 'flex-basis: 45%']      
      [#assign maxHeight = 'max-height: 50%']
    [/#if]

    <div class="gato-explore-image" style="${flexBasis}; ${maxWidth}; ${maxHeight};">
      [@cms.component content=component /]
    </div>
  [/#list]
</div>
[/#if]