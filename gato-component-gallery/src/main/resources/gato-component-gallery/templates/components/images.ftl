<ul class="txst-gallery" >
  [#list components as component ]
    <li class="txst-gallery-image">
      [@cms.component content=component /]
    </li>
  [/#list]
</ul>
