<div class="select-filters">
  <div class="header" tabindex="0" aria-haspopup="true" aria-expanded="false" aria-controls="${gf.uuidToHtmlId(content.@id)}">
    <span>All ${content.category!""}</span>
    <span class="sr-filters-selected visuallyhidden"></span>
    <i class="fa fa-angle-down" aria-hidden="true"></i>
  </div>
  <div class="body" id="${gf.uuidToHtmlId(content.@id)}">
    <ul>
      [#list cmsfn.children(content.filterlist) as tag]
        <li>
          <span class="filter-cbx" id="${tag.id}" tabindex="0" role="checkbox" aria-checked="false" aria-labelledby="${'label' + tag.id}" data-name="${tag.name}" data-group="${gf.uuidToHtmlId(content.@id)}"></span>
          <div class="filter-label" id="${'label' + tag.id}">${tag.name}</div>
        </li>
      [/#list]
    </ul>
  </div>
  <ul class="active-filters">
  </ul>
</div>
