<ul class="txst-gallery eq-parent">
  [#list components as component ]
    <li class="txst-gallery-image eq-xs-1-2 eq-sm-1-3 eq-md-1-4 eq-ml-1-5 eq-lg-1-6 eq-xl-1-8">
      [@cms.component content=component /]
    </li>
  [/#list]
  [#if cmsfn.isEditMode()]
    <li class="add txst-gallery-image eq-xs-1-2 eq-sm-1-3 eq-md-1-4 eq-ml-1-5 eq-lg-1-6 eq-xl-1-8" cms:add="box"></li>
  [/#if]
</ul>
