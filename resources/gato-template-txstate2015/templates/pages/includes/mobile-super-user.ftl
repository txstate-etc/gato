<ul class="mobile-super-list upper">
  [#list cmsfn.children(globalLinks.superGroup2, "mgnl:component") as component]
    <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
  [/#list]
</ul>
<ul class="mobile-super-list lower">
  [#list cmsfn.children(globalLinks.superGroup1, "mgnl:component") as component]
    <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
  [/#list]
</ul>
