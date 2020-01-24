[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    [#assign scripts = [
      'gato-template-wittliff/js/standard.cjs',
      'gato-template-wittliff/js/fontsdotcom.js'
    ]]
    [#if def.parameters.isEventsTemplate!false]
      [#assign scripts = scripts + ['gato-template-wittliff/js/wittliff-events.js']]
    [/#if]
    [@templatejs scripts /]
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-wittliff/css/standard.scss"/>
    [@templatehead publisher="The Wittliff Collections"/]
  </head>

  <body class="template-wittliff${(def.parameters.isHomeTemplate!false)?string(' wittliff-home', '')}${(def.parameters.isSpecialTemplate!false)?string(' wittliff-special', '')}${(def.parameters.isEventsTemplate!false)?string(' wittliff-events', '')}${cmsfn.isEditMode()?string(' admin','')}">
    [@skipnav/]
    [#include "includes/header.ftl"]
    [#if def.parameters.isHomeTemplate!false]
      [@cms.area name="hero-slider"/]
    [/#if]
    [#if def.parameters.isSpecialTemplate!false || def.parameters.isEventsTemplate!false]
      [@cms.area name="hero-banner"/]
    [/#if]
    <div class="page_content">
      [#assign hideSidebar = (content.hideSidebar!false) || (def.parameters.isHomeTemplate!false) || (def.parameters.isSpecialTemplate!false) || def.parameters.isEventsTemplate!false]
      [#if !cmsfn.isEditMode() && !gf.areaHasChildrenIncludingInheritance(content.navBlocks)]
        [#assign hideSidebar = true]
      [/#if]
      <main class="contentcolumn">
        [#if !(def.parameters.isSpecialTemplate!false) && !(def.parameters.isEventsTemplate!false)]
          [@headline hideSidebar /]
        [/#if]
        [#include "/gato-template/templates/includes/sacscocWarning.ftl"]
        [#if def.parameters.isMailTemplate!false]
          [@cms.area name="mail" contextAttributes={"hideSidebar":hideSidebar} /]
        [#elseif def.parameters.isHomeTemplate!false]
          [@cms.area name="home-content" contextAttributes={"hideSidebar":hideSidebar} /]
        [#elseif def.parameters.isEventsTemplate!false]
          [@cms.area name="events" contextAttributes={"hideSidebar":hideSidebar} /]
        [#else]
          [@cms.area name="contentParagraph" contextAttributes={"hideSidebar":hideSidebar} /]
        [/#if]
      </main>

      [#if !hideSidebar]
        <aside class="sidebar-container">
          <div class="sidebar">
            [@cms.area name="navBlocks" /]
          </div>
        </aside>
      [/#if]
    </div>
    [#include "includes/footer.ftl"]
    [@cssjsmodals /]
    [#if hideSidebar]
      [@sidebarmodal skipsocial=true /]
    [/#if]
    [#include "/gato-template/templates/includes/video-modal.ftl"]
    [#include "/gato-template/templates/includes/search-modal.ftl"]
  </body>
</html>
