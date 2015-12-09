[#assign pageid = cmsfn.page(content).@id]
[#list components as component]
  [#assign owner = cmsfn.page(component)]
  [#assign inherited = (pageid != owner.@id)]
  [#if !inherited || (component.inherit!false)]
    [#if inherited]
      <div class="inherited">Inherited from parent page: ${gf.nodeTitle(owner)}</div>
    [/#if]
    <div class="gato-custom-block">
      [@cms.component content=component /]
    </div>
  [/#if]
[/#list]
