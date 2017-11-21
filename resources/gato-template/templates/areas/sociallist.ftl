[#if component?has_content]
  [@cms.component content=component /]
[#elseif cmsfn.isEditMode()]
  <div class="socallist_add" cms:add="box"></div>
[/#if]
