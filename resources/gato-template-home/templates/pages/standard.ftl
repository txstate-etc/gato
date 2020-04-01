[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    [@googletagmanager /]
    [#assign scripts = ['gato-template-home/js/standard.cjs']]
    [@templatejs scripts /]

    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-home/css/standard.scss"/>
    [@templatehead publisher="Texas State"/]
  </head>
  <body class="${cmsfn.isEditMode()?then(' admin','')} ${(def.parameters.isHomeTemplate!false)?string(' txstate-home', '')}">
    [#assign isTXSTHome = true]
    [@skipnav/]
    [#include "/gato-template-mobilefirst/templates/pages/includes/header.ftl"]
    [#include "/gato-template-mobilefirst/templates/pages/includes/menu.ftl"]
    <div class="page-container" id="panel">
      [#assign isEmergency = false]
      [#if def.parameters.isHomeTemplate!false]
        [#include "/gato-template-home/templates/pages/includes/emergency.ftl"]
      [/#if]
      [#if !cmsfn.isEditMode()]
        <div class="header-bars">
          <div class="top-bar">
            <ul class="left-links">
              [#list cmsfn.children(globalLinks.superGroup1, "mgnl:component") as component]
                <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
              [/#list]
            </ul>

            <ul class="right-links">
              [#list cmsfn.children(globalLinks.superGroup2, "mgnl:component") as component]
                <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
              [/#list]
            </ul>
            <div class="dropdown">
              <button class="btn-audience" aria-haspopup="true" aria-controls="audience-panel" aria-expanded="false" role="button">Info For
                <i class="fa fa-angle-down" aria-hidden="true"></i>
              </button>

              <ul id="audience-panel" class="dropdown-content">
                [#list cmsfn.children(globalLinks.superGroup2, "mgnl:component") as component]
                  <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
                [/#list]
              </ul>
            </div>
          </div>
          <div class="bottom-bar">
            [@simplemenu/]
          </div>
        </div>
      [/#if]
      <main>
        [#if def.parameters.isHomeTemplate!false]
          [#include "includes/top-feature.ftl"]
        [#elseif def.parameters.isLandingTemplate!false]
          [@cms.area name="landing-banner"/]
        [/#if]
        [#if def.parameters.isHomeTemplate!false]

          [@cms.area name="homecontent"/]
        [#else]
          [#if !def.parameters.isHomeTemplate!false]
            <div class="gato-section-full">
              <div class="gato-section-centered">
                <div class="gato-section">
                  [@breadcrumbs true/]
                </div>
              </div>
            </div>
          [/#if]
          <div class="contentcolumn ${content.intro?has_content?then('', 'no-intro')}">
            [#assign hideSidebar = true /]
            [#assign hideTitle = false /]
            [@headline hideSidebar hideTitle/]
            [#if content.intro?has_content]
              <div class="page-intro-text">
                ${gf.processRichText(cmsfn.decode(content).intro)}
              </div>
            [/#if]
            [#if content.addTitleSeparator?has_content && content.addTitleSeparator == true]
              <div class="gato-section-full gato-section-title-separator">
                <div class="gato-section-centered">
                  <div class="gato-section">
                    <div class="intro-title-border"></div>
                  </div>
                </div>
              </div>
            [/#if]
            [@cms.area name="landingcontent"/]
          </div>
        [/#if]
      </main>
      [#include "/gato-template-mobilefirst/templates/pages/includes/footer.ftl"]
    </div>
    [@cssjsmodals /]
    [#include "/gato-template/templates/includes/video-modal.ftl"]
    [#assign useGlobalSearch = true]
    [#include "/gato-template/templates/includes/search-modal.ftl"]
    <!--  GENERATED-CONTENT-ENDS-DHTN23TN423HT4D -->
  </body>
</html>
