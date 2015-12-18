<ul class="mobile-super-list upper">
  [#list cmsfn.children(globalLinks.superGroup2, "mgnl:component") as component]
    <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
  [/#list]
  <li>
    <div class="gato-accordion" data-start-collapsed="true">
      <div class="gato-accordion-header">
        <a href="#">${globalLinks.superGroup3.text!'Online Services'} <i class="fa fa-caret-down"></i></a>
      </div>
      <div class="gato-accordion-content">
        <ul>
          [#list cmsfn.children(globalLinks.superGroup3, "mgnl:component") as component]
            <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
          [/#list]
        </ul>
      </div>
    </div>
  </li>
</ul>
<ul class="mobile-super-list lower">
  [#list cmsfn.children(globalLinks.superGroup1, "mgnl:component") as component]
    <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
  [/#list]
</ul>
