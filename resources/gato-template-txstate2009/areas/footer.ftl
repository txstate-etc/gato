[#if !content['library-footer']?has_content || ctx.forceFooter]
	<div class="txst-footer">
    [#list components as misctext]
      [@cms.component content=misctext /]
    [/#list]
	</div>
[/#if]
