<div class="masonry-section">
    <div class="masonry-sizer"></div>
    [#list components as component]
        [@cms.component content=component /]
    [/#list]
    [#if cmsfn.isEditMode()]
        <div class="gato-card gato-card-add gato-card-md" cms:add="box"></div>
    [/#if]
</div>
