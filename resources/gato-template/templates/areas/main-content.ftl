[#assign hideSidebar = ctx.getAttribute("hideSidebar")!false]
[#assign mainContentClass = hideSidebar?string('full-width','')]
[#list components as component]
    <div class="gato-section-parent">
        <div class="gato-section eq-parent ${mainContentClass}">
            [@cms.component content=component /]
        </div>
    </div>
[/#list]
[#if cmsfn.isEditMode()]
  <div class="addsection-parent">
    <div class="addsection ${mainContentClass}">
        <div class="mainContent_add ${mainContentClass}" cms:add="box"></div>
    </div>
  </div>
[/#if]
