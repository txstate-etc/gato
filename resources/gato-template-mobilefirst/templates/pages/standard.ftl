[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    [@googletagmanager /]
    [#assign scripts = ['gato-template-mobilefirst/js/standard.cjs']]
    [#assign customscripts = []]
    [#if def.parameters.isFilterableSearchTemplate!false]
      [#assign scripts = scripts + ['gato-area-filterable-search/js/filterablesearch.js']]
    [/#if]

    [@templatejs scripts/]
    [@templatehead/]
    [@cms.area name="templatecss"/]
    [#if def.parameters.isPassthroughTemplate!false]
      [#if content.javascript?has_content]
        [#list cmsfn.children(content.javascript) as import]
          <script type="text/javascript" src="${import.text}"></script>
        [/#list]
      [/#if]
      [#if content.css?has_content]
        [#list cmsfn.children(content.css) as import]
          <link rel="stylesheet" type="text/css" href="${import.text}">
        [/#list]
      [/#if]
    [/#if]
  </head>
  <body class="${cmsfn.isEditMode()?string('admin','')}">
    [@skipnav/]
    [@googletagmanagerbody /]
    [#include "includes/header.ftl"]
    [#include "includes/menu.ftl"]
    <div class="page-container" id="panel">
      [#if def.parameters.isFeatureTemplate!false]
        [@cms.area name="home-banner" content=gf.getOrCreateArea(homepage, 'home-banner')/]
      [#else]
        [@cms.area name="subpage-banner" content=gf.getOrCreateArea(page, 'subpage-banner')/]
      [/#if]
      [#import "/gato-template-mobilefirst/templates/includes/headerImageLogic.ftl" as headerLogic]
      [@cms.area name="organization-info" content=gf.getOrCreateArea(homepage, 'organization-info') editable=isHomePage contextAttributes={"isHome":def.parameters.isFeatureTemplate!false, "hasImage":headerLogic.hasImage}/]
      [#if !(def.parameters.isFeatureTemplate!false) && !(def.parameters.isPassthroughTemplate!false)]
      <div class="gato-section-full">
        <div class="gato-section-centered">
          <div class="gato-section">
            [@breadcrumbs/]
          </div>
        </div>
      </div>
      [/#if]
      <main class="contentcolumn ${content.intro?has_content?then('', 'no-intro')}">
        [#assign hideSidebar = true /]
        [@headline hideSidebar /]
        [#if !(content.hideTitle!false)]
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
        [/#if]
        [#if def.parameters.isFeatureTemplate!false]
          [@cms.area name="mobileFirstContent"/]
        [#else]
          [#if def.parameters.isMailTemplate!false]
            [@cms.area name="mail"/]
          [#elseif def.parameters.isFilterableSearchTemplate!false]
            [@cms.area name="filterable-search-intro"/]
            [@cms.area name="filterable-search"/]
          [#elseif def.parameters.isVariableTemplate!false]
            [@cms.area name="contentParagraph"/]
          [#elseif def.parameters.isSiteMapTemplate!false]
            [@cms.area name="siteMap" /]
          [#elseif def.parameters.isPassthroughTemplate!false]
						${gf.httpGetContentWithParameters(content.url)}
          [#else]
            [@cms.area name="calicoInformational"/]
          [/#if]
        [/#if]
      </main>
      [#include "includes/footer.ftl"]
    </div>
    [@cssjsmodals /]
    [#include "/gato-template/templates/includes/video-modal.ftl"]
  </body>
</html>
