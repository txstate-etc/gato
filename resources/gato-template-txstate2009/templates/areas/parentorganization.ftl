<h2 class="txst-khanbanner-parenttitle">
  [#if component?has_content]
    [@cms.component content=component /]
  [#else]
    <div cms:add="bar"></div>
  [/#if]
</h2>
