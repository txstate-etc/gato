[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]
<div class="flexible">
    <div class="flex-row">
        [@cms.area name="flex-top" contextAttributes={"colorClass":content.color!}/]
        [@cms.area name="flex-bottom" contextAttributes={"colorClass":content.color!}/]
    </div>
</div>