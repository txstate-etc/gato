[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]
<div class="controls">
  <button class="btn-toggle-filters" aria-haspopup="true" aria-expanded="false" aria-controls="filter-container" aria-label="Search Filters">
    <i class="fa" aria-hidden="true"></i>
    <span class="label"></span>
  </button>
  <div class="toggle-view">
    <button class="btn-list-view"><i class="fa fa-list"></i>List View</button>
    <button class="btn-grid-view"><i class="fa fa-th"></i>Grid View</button>
  </div>
</div>
<div class="filterable-search">
  [@cms.area name="filters"/]
  [@cms.area name="listitems"/]
</div>
