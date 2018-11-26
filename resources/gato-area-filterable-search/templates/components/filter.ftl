<div class="select-filters">
  <div class="header" tabindex="0" aria-haspopup="true" aria-expanded="false">
    <span>All ${content.title!""}</span>
    <i class="fa fa-angle-down"></i>
  </div>
  <div class="body">
    <ul>
      [#list cmsfn.children(content.filterlist) as tag]
        <li>
          <span class="filter-cbx" id="${tag.id}" tabindex="0" role="checkbox" aria-checked="false" aria-labelledby="${'label' + tag.id}" data-name="${tag.name}"></span>
          <div class="filter-label" id="${'label' + tag.id}">${tag.name}</div>
        </li>
      [/#list]
    </ul>
  </div>
  <ul class="active-filters">
  </ul>
</div>
