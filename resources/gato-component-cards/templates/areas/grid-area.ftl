[#list components as component]
    [@cms.component content=component contextAttributes={"cardsperrow":ctx.cardsperrow!"gato-card-md"}/]
[/#list]
[#if cmsfn.isEditMode()]
    <div class="grid-item grid-card-add ${ctx.cardsperrow!}" cms:add="box"></div>
[/#if]
