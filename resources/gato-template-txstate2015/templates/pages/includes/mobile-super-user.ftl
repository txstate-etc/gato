[#assign globalData = cmsfn.asContentMap(cmsfn.nodeByPath('/global-data', 'website'))]
<ul class="mobile-super-list upper">
  [#list cmsfn.children(globalData.superGroup2, "mgnl:component") as component]
    <li>[@cms.component content=component/]</li>
  [/#list]
  <li>
    <div class="gato-accordion" data-start-collapsed="true">
      <div class="gato-accordion-header">
        <a href="#">More Tools <i class="fa fa-caret-down"></i></a>
      </div>
      <div class="gato-accordion-content">
        <ul>
          [#list cmsfn.children(globalData.superGroup3, "mgnl:component") as component]
            <li>[@cms.component content=component/]</li>
          [/#list]
        </ul>
      </div>
    </div>
  </li>
</ul>
<ul class="mobile-super-list lower">
  [#list cmsfn.children(globalData.superGroup1, "mgnl:component") as component]
    <li>[@cms.component content=component/]</li>
  [/#list]
</ul>
