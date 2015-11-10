<ul class="foot_linkage">
	[#list components as component ]
            <li>[@cms.component content=component /]</li>
    [/#list]
    [#if cmsfn.isEditMode()]
      <div class="link_add" cms:add="box"></div>
    [/#if]
</ul>