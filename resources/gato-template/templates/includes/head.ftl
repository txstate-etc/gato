[#include "/gato-lib/templates/includes/head.ftl"]
[#include "/gato-component-cssjs/templates/includes/head.ftl"]
[#include "/gato-template/templates/includes/component.ftl"]
[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#include "/gato-template/templates/includes/analytics.ftl"]

[#macro templatejs scripts]
  [@javascriptvariables]
    var peoplesearch_token_url = '${gf.peopleSearchTokenPath()}';
    var peoplesearch_jwt_url = '${gf.peopleSearchJwtPath()}';
    var search_global_url = '${gf.filterUrl('/search')}';
  [/@javascriptvariables]
  [#if cmsfn.isEditMode()]
    [#local scripts = [
      'gato-template/js/edit-bars.js'
    ]+scripts]
  [/#if]
  [@javascript scripts = ['/gato-template/js/includes.cjs']+scripts /]
[/#macro]

[#macro templatehead publisher="Texas State University"]
  [@meta publisher /]
  [@customCSS page ancestorstopdown /]
  <script type="text/javascript" src="${gf.replaceExtension(cmsfn.link(page), 'js')}"></script>
  [@rssautodiscover /]
  [@title publisher /]
  [@googleanalytics /]
  [@favicons /]
  [@cms.page /]
[/#macro]

[#macro title rootorg="Texas State University"]
  <title>
    [@pagetitle page /]
    [#if !isHomePage]: [@pagetitle homepage /][/#if]
    [#if rootorg == "Texas State University"]: ${rootorg}[/#if]
  </title>
[/#macro]

[#macro favicons]
  [#if def.parameters.favicon?has_content]
    <link rel="icon" type="image/png" sizes="64x64"  href="${gf.resourcePath()+def.parameters.favicon}">
  [/#if]
  [#if def.parameters.touchicon?has_content]
    <link rel="apple-touch-icon" href="${gf.resourcePath()+def.parameters.touchicon}">
  [/#if]
[/#macro]

[#macro meta publisher="Texas State University"]
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  [#if page.metaNoIndex?has_content]
    <meta name="ROBOTS" content="NOINDEX">
  [/#if]
  [#if page.metaDescription?has_content]
    <meta name="description" content="${page.metaDescription}">
    <meta name="DC.description" content="${page.metaDescription}">
  [/#if]
  [#if page.metaKeywords?has_content]
    <meta name="keywords" content="${page.metaKeywords}">
    <meta name="DC.subject" content="${page.metaKeywords}">
  [/#if]
  <meta name="DC.publisher" content="${publisher}">
  <meta name="DC.creator" content="${page}">
  <meta name="DC.date" content="${cmsfn.metaData(page, 'mgnl:lastModified')}">
    [#local currency = gf.getStaleTimer(content)]
    [#local contentIsStale = gf.isStale(content,currency)]
  [#if contentIsStale]
  <meta name="contentIsStale" content="${contentIsStale?c}">
  [/#if]
  <meta name="staleTimer" content="${currency}">
[/#macro]

[#macro rssautodiscover]
  [#if content.enableRSS!false]
    <link rel="alternate" type="application/rss+xml" title="RSS"
      href="${gf.replaceExtension(cmsfn.link(content), 'rss')}">
  [/#if]
[/#macro]

[#macro sidebarmodal skipsocial=false]
  [#if cmsfn.isEditMode()]
    <div id="gato-navcolumn" class="gato-navcolumn">
        [@cms.area name="navBlocks"/]
      <!-- social media links -->
      [#if !skipsocial]
        [@cms.area name="socialmedia" content=gf.getOrCreateArea(homepage, 'socialmedia') editable=isHomePage /]
      [/#if]
      </div>
    <script type="text/javascript">
        var navmodal = new modal($('gato-navcolumn'));
        navmodal.addToMainbar('Sidenav');
    </script>
  [/#if]
[/#macro]

[#macro bannermodal]
  [#if cmsfn.isEditMode()]
    <div id="gato-banner-modal">
      [@cms.area name="gato-banners"/]
    </div>
    <script type="text/javascript">
      var bannmodal = new modal($('gato-banner-modal'));
      bannmodal.addToMainbar('Banners');
    </script>
  [/#if]
[/#macro]

[#macro pagetitle page]${gf.nodeTitle(page)}[/#macro]

[#macro mainmenu textmenu=false]
  <nav class="ddmenu-bg">
    <div class="ddmenu-menubar">
      [@navloop cmsfn.children(homepage, 'mgnl:page') ; page]
        <div class="ddmenu-menubaritem ${gf.hasNavChildren(page)?string('haschildren', '')}">
          <a href="${cmsfn.link(page)}" class="ddmenu-menubaritem">${gf.nodeTitle(page)}</a>
          [#if gf.hasNavChildren(page)]
            <ul class="ddmenu-menu">
              [@navloop cmsfn.children(page, 'mgnl:page') ; subpage]
                <li><a href="${cmsfn.link(subpage)}">${gf.nodeTitle(subpage)}</a></li>
              [/@navloop]
            </ul>
          [/#if]
        </div>
      [/@navloop]
      [#nested]
    </div>
  </nav>
[/#macro]

[#macro simplemenu arrows=false]
  <ul class="simplemenu">
    [@navloop cmsfn.children(homepage, 'mgnl:page') ; page]
      <li class="${gf.hasNavChildren(page)?string('haschildren', '')}">
        <a href="${cmsfn.link(page)}">${gf.nodeTitle(page)}</a>
        [#if gf.hasNavChildren(page)]
          [#assign submenuid = gf.uuidToHtmlId(page.@id)]
          [#if arrows]
            <button aria-haspopup="true" aria-expanded="false" aria-controls="menu-${submenuid}" class="simplemenu-expand">
              <span class="visuallyhidden">sub menu for ${gf.nodeTitle(page)}</span>
              <i class="fa fa-angle-down" aria-hidden="true"></i>
            </button>
          [/#if]
          <ul class="simplemenu-subitems" id="menu-${submenuid}">
            [@navloop cmsfn.children(page, 'mgnl:page') ; subpage]
              <li><a href="${cmsfn.link(subpage)}">${gf.nodeTitle(subpage)}</a></li>
            [/@navloop]
          </ul>
        [/#if]
      </li>
    [/@navloop]
    [#nested]
  </ul>
[/#macro]

[#macro mobilemenu page]
  [#if gf.hasNavChildren(page)]
    <nav id="iphone-navigationarea">
      <ul class="iphone-navigation">
        [@navloop cmsfn.children(page, 'mgnl:page') ; subpage]
          <li><a href="${cmsfn.link(subpage)}">${gf.nodeTitle(subpage)}</a></li>
        [/@navloop]
      </ul>
    </nav>
  [/#if]
[/#macro]

[#macro breadcrumbs hidetxstate=false]
  <div class="breadcrumbs">
    [#if !hidetxstate]
      <a href="http://www.txstate.edu">Texas State</a>
      <span class="separator"><i class="fa fa-angle-right"></i></span>
    [/#if]
    [#-- Put the parent organization in the breadcrumbs if there is one --]
    [#if (homepage.parentOrganization)?? && cmsfn.children(homepage.parentOrganization)?size gt 0 ]
      [#local parentOrg = cmsfn.children(homepage.parentOrganization)?first]
      [#if parentOrg.parent_name?? && parentOrg.parent_name?length gt 0]
        <a href="${gf.filterUrl(parentOrg.url!)}">${parentOrg.parent_name}</a>
        <span class="separator"><i class="fa fa-angle-right"></i></span>
      [/#if]
    [/#if]
    [#list ancestorstopdown as ancestor]
      <a href="${cmsfn.link(ancestor)}">${gf.nodeTitle(ancestor)}</a>
      <span class="separator"><i class="fa fa-angle-right"></i></span>
    [/#list]
    ${gf.nodeTitle(page)}
  </div>
[/#macro]

[#macro search image='gato-template/images/x.gif' ]
  <form action="http://search.txstate.edu/search" class="gato-search">
    <input type="hidden" name="site" value="txstate_no_users" />
    <input type="hidden" name="client" value="txstate" />
    <input type="hidden" name="output" value="xml_no_dtd" />
    <input type="hidden" name="proxystylesheet" value="txstate" />
    <input type="hidden" name="sitesearch" value="${ctx.request.serverName}" />
    [#nested]
    <input type="text" class="gato-search-query" name="q" size="15" placeholder="Search this site" aria-label="Search" />
    <input type="image" src="${gf.resourcePath()}/${image}" class="gato-search-submit" alt="Start Search"/>
  </form>
[/#macro]

[#macro skipnav maincontent='maincontent']
  <a class="skip-nav" href="#${maincontent}">Skip to Content</a>
[/#macro]

[#macro headline hideSidebar=false]
  [#if !isHomePage && !(content.hideTitle!false)]
    [#if hideSidebar]
      [#assign fullwidth = 'full-width']
    [/#if]
    <div class="gato-section-full ${fullwidth!}">
      <div class="gato-section-centered">
        <div class="gato-section">
          <h1 id="maincontent" class="headline">${gf.nodeTitle(content)}</h1>
        </div>
      </div>
    </div>
  [#else]
    <h1 id="maincontent" class="visuallyhidden">${gf.nodeTitle(content)}</h1>
  [/#if]
[/#macro]
