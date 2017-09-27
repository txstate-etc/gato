[#list components as component]
  [@cms.component content=component contextAttributes={"cardsize":ctx.cardsize, "sizes":ctx.sizes, "cardindex":component?index}/]
[/#list]
[#if cmsfn.isEditMode()]
    <div class="gato-card gato-card-add ${ctx.cardsize}" cms:add="box"></div>
[/#if]
