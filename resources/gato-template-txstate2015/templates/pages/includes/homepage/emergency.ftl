[#assign emergency = homepage.emergency! /]
[#if emergency?has_content]
  [#list gf.searchComponentsOnPageInJcrOrder(emergency.contentParagraph, [
      'gato-template:components/textimage'
  ]) as component]
    [#if component.title?has_content]
      [#assign emergencyTitle = component.title /]
      [#assign emergencyTime = gf.getModificationDate(component)?string("MMM. dd, yyyy 'at' h:mm a z") /]
      [#break /]
    [/#if]
  [/#list]

  [#if emergencyTitle?has_content]
    <div class="emergency">
      <a class="emergency-link" href="${cmsfn.link(emergency)}">
        <div class="emergency-wrap">

          <div class="alert-top">
            <p><i class="fa fa-exclamation-triangle"></i> Texas State Alert</p>
          </div>

          <div class="alert-message">
            <p>${emergencyTitle}</p>
          </div>

          <div class="alert-timestamp">
            [#-- <p>Updated: Oct. 30, 2015 at 10:04 a.m. CDT</p> --]
            <p>Updated: ${emergencyTime}</p>
          </div>

        </div>
      </a>
    </div>
  [/#if]
[/#if]
