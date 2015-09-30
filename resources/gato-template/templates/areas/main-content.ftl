[#assign hideSidebar = ctx.getAttribute("hideSidebar")!false]
[#assign mainContentClass = hideSidebar?string('eq-lg-1-1','eq-lg-3-4')]
[#list components as component]
    <div class="gato-component ${mainContentClass}">
        [@cms.component content=component /]
    </div>
[/#list]