<div class="masonry-section ${cmsfn.editMode?string('margin-editor', '')}">
    <div class="masonry-sizer"></div>
    [#list components as component]
        [@cms.component content=component /]
    [/#list]
    [#if cmsfn.isEditMode()]
    <div class="card-item card-item-add card-item-md" cms:add="box"></div>
    [/#if]
</div>
