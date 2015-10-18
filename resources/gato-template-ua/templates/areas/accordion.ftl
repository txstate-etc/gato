<div id="accordion_container">
  [#if cmsfn.isEditMode()]
    <div class="slides-admin">
      [#list components as slide]
        [@cms.component content=slide contextAttributes={"barsonly": true} /]
      [/#list]
      <div cms:add="bar"></div>
    </div>
  [/#if]

  [#list components as slide]
    [@cms.component content=slide contextAttributes={
      'fgactive':def.parameters.fgactive,
      'shactive':def.parameters.shactive,
      'fginactive':def.parameters.fginactive,
      'shinactive':def.parameters.shinactive
    } editable = false /]
  [/#list]
  <script type="text/javascript">
    new accordion({speed: 0.5});
  </script>
</div>

