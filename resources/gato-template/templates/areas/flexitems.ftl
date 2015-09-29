[#assign maxwidth = def.parameters.maxitemwidth!"100vw")]

<div class="gato-flex-container">
  [#list components as component]
    <div class="gato-flex-item">
      [@cms.component content=component contextAttributes={"maxwidth":maxwidth} /]
    </div>
  [/#list]
</div>
