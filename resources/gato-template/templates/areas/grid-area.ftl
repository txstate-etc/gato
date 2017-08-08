[#list components as component]
    [@cms.component content=component contextAttributes={"cardsperrow":ctx.cardsperrow!"gato-card-md"}/]
[/#list]
[#if cmsfn.isEditMode()]
    <div class="gato-item gato-card-add" cms:add="box"></div>
[/#if]
