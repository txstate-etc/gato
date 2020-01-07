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
    [#if def.parameters.isSearchTemplate!false]
      [#assign scripts = scripts + ['gato-template/js/globalsearch.js']]
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
  <body class="${cmsfn.isEditMode()?string('admin','')} ${(def.parameters.isSearchTemplate!false)?then('search-page', '')}">
    [@skipnav/]
    [@googletagmanagerbody /]
    [#include "includes/header.ftl"]
    [#include "includes/menu.ftl"]
    <div class="page-container" id="panel">
      [@cms.area name="calico-hero" content=gf.getOrCreateArea(page, 'calico-hero')/]
      [@cms.area name="organization-info" content=gf.getOrCreateArea(homepage, 'organization-info') editable=isHomePage /]
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
          [#if def.parameters.isSearchTemplate!false]
            [@cms.area name="searchcontent" /]
          [#elseif def.parameters.isMailTemplate!false]
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
    [#assign useGlobalSearch = false]
    [#assign showSearchScope = true]
    [#if def.parameters.isSearchTemplate!false || def.parameters.isPassthroughTemplate!false]
      [#assign useGlobalSearch = true]
    [/#if]
    [#include "/gato-template/templates/includes/search-modal.ftl"]
  </body>
</html>
