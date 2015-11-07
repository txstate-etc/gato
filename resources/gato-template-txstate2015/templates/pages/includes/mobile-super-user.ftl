[#assign globalData = cmsfn.asContentMap(cmsfn.nodeByPath('/global-data', 'website'))]
<div class="mobile-super-user">
    <div class="mobile-super-list">
        <ul class="mobile-super-list">
            [#list cmsfn.children(globalData.superGroup2, "mgnl:component") as component]
                <li>[@cms.component content=component/]</li>
            [/#list]
            <li>
                <div class="gato-accordion" data-start-collapsed="true">
                    <div class="gato-accordion-header">
                        <a href="#">
                        More Tools
                        <i class="fa fa-caret-down"></i>
                        </a>
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
    </div>
</div>
<div class="mobile-super-user lower">
    <div class="mobile-super-list">
        <ul class="about-nav mobile-super-list">
            [#list cmsfn.children(globalData.superGroup1, "mgnl:component") as component]
                <li>[@cms.component content=component/]</li>
            [/#list]

        </ul>
    </div>
</div>