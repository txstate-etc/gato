[#list components as component]
    [@cms.component content=component /]
[/#list]
[#if cmsfn.isEditMode()]
    <div class="gato-card gato-card-add" cms:add="box"></div>
[/#if]
