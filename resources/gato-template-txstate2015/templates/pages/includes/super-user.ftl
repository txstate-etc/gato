<div class="super-user-menu">
    <div class="super-user-content constrain eq-parent">
        <div class="eq-mn-1-2">
            <ul class="super-list super-list-left">
                [#list cmsfn.children(globalLinks.superGroup1, "mgnl:component") as component]
                    <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
                [/#list]
            </ul>
        </div><div class="eq-mn-1-2">
            <ul class="super-list super-list-right">
                [#list cmsfn.children(globalLinks.superGroup2, "mgnl:component") as component]
                    <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
                [/#list]
                <li class="more-tools">
                    <a href="#">
                    More Tools
                    <i class="fa fa-caret-down"></i>
                    </a>
                    <ul class="super-list-sub">
                        [#list cmsfn.children(globalLinks.superGroup3, "mgnl:component") as component]
                            <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
                        [/#list]
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</div>
