<div class="txst-photogallery" data-path="${cmsfn.asJCRNode(cmsfn.parent(content, 'mgnl:component')).path}">
  [#list components as component ]
    <div class="txst-photogallery-image">
      [@cms.component content=component /]
    </div>
  [/#list]
</div>
