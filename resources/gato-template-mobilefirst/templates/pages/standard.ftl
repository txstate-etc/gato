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
      [#assign scripts = scripts + ['gato-template/js/globalsearch.js', 'gato-template-mobilefirst/js/searchfooterfix.js']]
    [/#if]
    [#if def.parameters.isAcademicCalendar!false]
      [#assign scripts = scripts + ['gato-template-mobilefirst/js/dropdown.js','gato-template-mobilefirst/js/academiccalendar.js']]
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
    <div class="page-container" id="panel" aria-hidden="false">
      <div class="banner-section">
        [@cms.area name="calico-hero" content=gf.getOrCreateArea(page, 'calico-hero')/]
        [#assign hero = gf.singleComponent(page, 'calico-hero')!]
        [#assign showAnnouncement = false]
        [#if def.parameters.isAdmissionsHome!false]
          [#if gf.isEmptyString(hero) || hero.size! == "large"]
            [#assign showAnnouncement = true]
            [@cms.area name="bannerAnnouncement" content=gf.getOrCreateArea(page, 'bannerAnnouncement')/]
          [/#if]
        [/#if]
      </div>
      [@cms.area name="organization-info" content=gf.getOrCreateArea(homepage, 'organization-info') editable=isHomePage /]
      [#if showAnnouncement]
        <div class="mobile-announcement">
          [@cms.area name="bannerAnnouncement" content=gf.getOrCreateArea(page, 'bannerAnnouncement')/]
        </div>
      [/#if]
      [#if !(def.parameters.isFeatureTemplate!false) && !(def.parameters.isPassthroughTemplate!false)]
      <div class="gato-section-full">
        <div class="gato-section-centered">
          <div class="gato-section">
            [#if cmsfn.metaData(homepage, "mgnl:template") == "gato-template-home:pages/home"]
              [@breadcrumbs true true/]
            [#else]
              [@breadcrumbs false true/]
            [/#if]
          </div>
        </div>
      </div>
      [/#if]
      <div class="main-content">
        <main class="contentcolumn ${content.intro?has_content?then('', 'no-intro')}">
          [#assign hideSidebar = true /]
          [#assign hideTitle = false /]
          [#if def.parameters.isAcademicCalendar!false]
          <div class="calendar-data-error">
            <h2 class="error-title">Error: 500 - INTERNAL SERVER </h2>
            <p class="error-description">Having trouble connecting to the data source. The following calendar is cached and may not be completely accurate</p>
          </div>
          [/#if]
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
          [#include "/gato-template/templates/includes/sacscocWarning.ftl"]
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
            [#elseif def.parameters.isAcademicCalendar!false]
              [@cms.area name="academiccalendar-intro"/]
              [@cms.area name="academiccalendar"/]
            [#else]
              [@cms.area name="calicoInformational"/]
            [/#if]
          [/#if]
        </main>
      </div>
      [#include "includes/footer.ftl"]
    </div>
    [@cssjsmodals /]
    [#if !cmsfn.isEditMode()]
    <button id="backtotop" aria-hidden="true" tabindex="-1">
      <i class="fa fa-angle-up" aria-hidden="true"></i>
      BACK TO TOP
    </button>
    [/#if]
    [#include "/gato-template/templates/includes/video-modal.ftl"]
    [#assign useGlobalSearch = false]
    [#assign showSearchScope = true]
    [#if def.parameters.isSearchTemplate!false || def.parameters.isPassthroughTemplate!false]
      [#assign useGlobalSearch = true]
    [/#if]
    [#if def.parameters.isAcademicCalendar!false]
      [#include "/gato-template-mobilefirst/templates/pages/includes/academic-calendar-modal.ftl"]
    [/#if]
    [#include "/gato-template/templates/includes/search-modal.ftl"]
  </body>
</html>
