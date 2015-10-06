[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html>
<head>
  [@templatejs scripts=[
  ]/]
  <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-txstate2009/css/standard.compiled.css"/>
  [@templatehead/]
</head>
<body class="${cmsfn.isEditMode()?string('admin','')} ${isHomePage?string('homepage','')}">
  <header class="txst-topbanner">
    <div class="txst-banner-shadow"></div>
    <div class="txst-banner-content">
      <a href="http://www.txstate.edu/"
        class="txst-banner-homelink" title="Texas State Home Page">
        <img src="${gf.resourcePath()}/gato-template-txstate2009/images/destroyer-logo.jpg" alt="Texas State University Logo"/>
      </a>
      [@cms.area name="webtools" editable=false /]
      [#include "/gato-template/templates/includes/search.ftl"]
      <div class="txst-mainsite-banner-links">
        <a href="http://www.txstate.edu/about.html">About Texas State</a>
        <a href="http://www.txstate.edu/library.html">Library</a>
        <a href="http://www.txstate.edu/maps.html">Maps</a>
        <a href="http://www.txstate.edu/round-rock.html">Round Rock Campus</a>
      </div>
    </div>
  </header>
  <div class="txst-khan-frame">
    <header class="txst-banner">
      [#include "/gato-template-txstate2009/templates/includes/gato-banner-settings.ftl"]
      <div class="txst-khanbanner ${showBannerArea?string('', 'txst-khanbanner-hideimage')}">
        <div class="txst-khanbanner-entityidentity">
          [@cms.area name="parentOrganization" content=gf.getOrCreateArea(homepage, 'parentOrganization') editable=isHomePage /]
          <h1 class="txst-khanbanner-departmenttitle">
            <a href="${cmsfn.link(homepage)}">${gf.nodeTitle(homepage)}</a>
          </h1>
        </div>
        [@cms.area name="gato-banners"/]
        [@mainmenu textmenu=true /]
        <div class="txst-khanbanner-siteinfo">
          <div class="vcenter">
            [@cms.area name="siteinfo" content=gf.getOrCreateArea(homepage, 'siteinfo') editable=isHomePage/]
          </div>
        </div>
      </div>
    </header>
    <div class="txst-khan-contentarea ${(content.hideSidebar!false)?string('txst-khan-fullwidth', '')}">
      [#if !(content.hideSidebar!false)]
        <div class="gato-navcolumn">
          <div class="txst-khan-nav-bg"></div>
          [@cms.area name="navBlocks" /]
          <h3>Join the Conversation</h3>
          [@cms.area name="socialmedia" /]
        </div>
      [/#if]
      <main class="txst-khan-contentcolumn txst-styledcontent">
        [@breadcrumbs/]
        [@cms.area name="contentParagraph" /]
      </main>
      [@cms.area name="footer" content=gf.getOrCreateArea(homepage, 'footer') editable=isHomePage /]
    </div>
    [#if content['library-footer']?has_content]
      <div class="library-footer">
        [@cms.area name="library-footer" content=(homepage['library-footer']) editable=false /]
      </div>
      <div class="more-footer">
        [@cms.area name="footer" content=gf.getOrCreateArea(homepage, 'footer') contextAttributes={"forceFooter": true} editable=false /]
      </div>
    [/#if]
  </div>
  <div class="full-site-link" style="display: none">
    <a href="javascript: createCookie('gatoforcedesktop', 'no'); location.reload(true);">View Mobile Site</a>
  </div>
  [@cssjsmodals /]
</body>
</html>
