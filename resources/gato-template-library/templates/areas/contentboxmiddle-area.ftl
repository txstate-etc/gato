[#list components as component]
  [#assign showThisEvent = false ] 
  [#if cmsfn.isPublicInstance() || cmsfn.isPreviewMode()]
    [#assign showThisEvent = model.showEvent(component.endDate)]
  [/#if]
  [#if cmsfn.isEditMode()]
    [#assign showThisEvent = true]
  [/#if]

  [#if showThisEvent]
    <div class="vevent txst-eventsbox-entry">
     [@cms.component content=component/]
    </div>
  [/#if]
[/#list]
[#if cmsfn.isEditMode()]
  <div class="event_add" cms:add="box"></div>
[/#if]
