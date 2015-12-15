[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html>
<head>
	[@javascript scripts = [
		'gato-template-txstate2009/js/main-menus.js',
		'gato-template-txstate2009/js/webtools.js',
		'gato-template-txstate2009/js/viewfullsite.js',
		'gato-template/js/outgoing-clicks.js',
		'gato-template/js/accordion.js',
		'gato-template/js/easter-egg.js',
		'gato-template/js/edit-bars.js',
		'gato-lib/js/moment.js',
		'gato-lib/js/jsonp.js',
		'gato-lib/js/pickadate/picker.js',
		'gato-lib/js/pickadate/picker.date.js',
		'gato-lib/js/photoswipe/photoswipe.js',
		'gato-lib/js/photoswipe/photoswipe-ui-default.js',
		'gato-lib/js/photoswipe-util.js',
		'gato-lib/js/spin.min.js',
		'gato-lib/js/slick/slick.min.js',
		'gato-lib/js/flowplayer/flowplayer.min.js',
		'gato-component-gallery/js/gallery.js',
		'gato-component-feature/js/feature.js',
		'gato-component-faq/js/expand.js',
		'gato-template/js/standardista-table-sorting.js',
		'gato-area-mail/js/mailForm.js',
		'gato-component-streaming/js/streaming.js'
	] /]
  <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-txstate2009/css/standard.compiled.css"/>
  [@templatehead/]
</head>
<body class="${cmsfn.isEditMode()?string('admin','')} ${isHomePage?string('homepage','')}" style="font-size: 16px">
  <div class="txst-topbanner">
    <div class="txst-banner-shadow"></div>
    <div class="txst-banner-content">
      <a href="http://www.txstate.edu/"
        class="txst-banner-homelink" title="Texas State Home Page">
        <img src="${gf.resourcePath()}/gato-template-txstate2009/images/destroyer-logo.jpg" alt="Texas State University Logo"/>
      </a>
      [@cms.area name="webtools" editable=false /]
      <div class="txst-mainsite-banner-links">
        <a href="http://www.txstate.edu/about.html">About Texas State</a>
        <a href="http://www.txstate.edu/library.html">Library</a>
        <a href="http://www.txstate.edu/maps.html">Maps</a>
        <a href="http://www.txstate.edu/round-rock.html">Round Rock Campus</a>
      </div>
    </div>
  </div>
  <div class="txst-khan-frame">
    <div class="txst-banner">
      [@bannerSettings content=content areaname='gato-banners'/]
      <div class="txst-khanbanner ${showBannerArea?string('', 'txst-khanbanner-hideimage')}">
        <div class="txst-khanbanner-entityidentity">
          <div class="center-me">
            <div class="center-me-in-ie">
              [@cms.area name="parentOrganization" content=gf.getOrCreateArea(homepage, 'parentOrganization') editable=isHomePage /]
              <h1 class="txst-khanbanner-departmenttitle">
                <a href="${cmsfn.link(homepage)}">${gf.nodeTitle(homepage)}</a>
              </h1>
            </div>
          </div>
        </div>
        <div id="gato-banner" class="${(cmsfn.isEditMode() || showBannerArea)?string('','gato-banner-hidden')}">
          [@cms.area name="gato-banners"/]
        </div>
        <!-- MAIN MENUS -->
        <div class="txst-khanbanner-ddmenu" id="ddmenu-parent">
          <div class="ddmenu-menubar">
            [@navloop cmsfn.children(homepage, 'mgnl:page') ; page]
              [#assign hasChildren = gf.hasNavChildren(page)]
              <div class="ddmenu-menubaritem">
                [#assign imageName = (page.title!'')?replace('\\W', '', 'r')]
                [#assign cacheStr = gf.getCacheStr('imagemenus-001')]
                [#if hasChildren]
                  [#assign activeURL = gf.getImageHandlerBase()+cacheStr+'/imagehandler/khanmenuactive/'+imageName+'.gif']
                  [#assign inactiveURL = gf.getImageHandlerBase()+cacheStr+'/imagehandler/khanmenu/'+imageName+'.gif']
                [#else]
                  [#assign activeURL = gf.getImageHandlerBase()+cacheStr+'/imagehandler/khanmenuactiveempty/'+imageName+'.gif']
                  [#assign inactiveURL = gf.getImageHandlerBase()+cacheStr+'/imagehandler/khanmenuempty/'+imageName+'.gif']
                [/#if]
                <a href="${cmsfn.link(page)}" class="ddmenu-menubaritem" style="background: url(${activeURL}?text=${(cmsfn.decode(page).title!'')?url?replace('(','%28')?replace(')','%29')?replace("'",'%27')})">
                  <img src="${inactiveURL}?text=${(cmsfn.decode(page).title!'')?url}" alt="${page.title!}"/>
                </a>
                [#if hasChildren]
                  <div class="ddmenu-menu-wrap">
                    <div class="png-bg">
                      <ul class="ddmenu-menu">
                        [@navloop cmsfn.children(page, 'mgnl:page') ; subpage]
                          <li><a href="${cmsfn.link(subpage)}">${subpage.title!}</a></li>
                        [/@navloop]
                      </ul>
                    </div>
                  </div>
                [/#if]
              </div>
            [/@navloop]
          </div>
        </div>
        <!-- END MAIN MENUS -->
        <div class="txst-khanbanner-siteinfo">
          <div class="center-me">
            <div class="center-me-in-ie">
              [@cms.area name="siteinfo" content=gf.getOrCreateArea(homepage, 'siteinfo') editable=isHomePage/]
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="txst-khan-contentarea ${(content.hideSidebar!false)?string('txst-khan-fullwidth', '')}">
      [#if !(content.hideSidebar!false)]
        <div class="gato-navcolumn">
          <div class="txst-khan-nav-bg"></div>
          [@cms.area name="navBlocks" /]
					[#include "/gato-template/templates/includes/socialsidenav.ftl"]
        </div>
      [/#if]
      <div class="txst-khan-contentcolumn txst-styledcontent gato-styledcontent">
        <div class="txst-contentarea">
          [@breadcrumbs/]
          <h1 id="maincontent" tabindex="-1" class="${(isHomePage || (content.hideTitle!false))?string('visuallyhidden','')}">${content.title!}</h1>
          [#if def.parameters.isMailTemplate!false]
            [@cms.area name="mail" /]
          [#else]
            [@cms.area name="contentParagraph" contextAttributes={"iam2009tmpl": true} /]
          [/#if]
        </div>
      </div>
      <div class="txst-footer">
        [@cms.area name="footer" content=gf.getOrCreateArea(homepage, 'footer') editable=isHomePage /]
      </div>
    </div>
  </div>
  <div class="full-site-link" style="display: none">
    <a href="javascript: createCookie('gatoforcedesktop', 'no'); location.reload(true);">View Mobile Site</a>
  </div>
  [@cssjsmodals /]
</body>
</html>
