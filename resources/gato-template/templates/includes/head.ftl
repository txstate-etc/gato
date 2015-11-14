[#include "/gato-lib/templates/includes/head.ftl"]
[#include "/gato-component-cssjs/templates/includes/head.ftl"]
[#include "/gato-template/templates/includes/component.ftl"]
[#include "/gato-template/templates/includes/analytics.ftl"]

[#macro templatejs scripts]
	[@javascript scripts = [
		'gato-template/js/main-menus.js',
		'gato-template/js/outgoing-clicks.js',
		'gato-template/js/post-load.js',
		'gato-template/js/accordion.js',
		'gato-template/js/easter-egg.js',
		'gato-template/js/webtools.js',
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
		'gato-template/js/standardista-table-sorting.js',
		'gato-area-mail/js/mailForm.js',
		'gato-component-streaming/js/streaming.js'
		'gato-component-twitter/js/twitter.js'
	]+scripts /]
[/#macro]

[#macro templatehead publisher="Texas State University"]
	[@meta publisher /]
	[@customCSS page ancestorstopdown /]
	[@customJS page ancestorstopdown /]
	[@title publisher /]
	[@googleanalytics /]
	[@javascriptvariables /]
	[@cms.page /]
[/#macro]

[#macro title rootorg]
	<title>
		[@pagetitle page /]
		[#if !isHomePage]: [@pagetitle homepage /][/#if]
		[#if rootorg == "Texas State University"]: ${rootorg}[/#if]
	</title>
[/#macro]

[#macro meta publisher="Texas State University"]
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	[#if page.metaNoIndex?has_content]
		<meta name="ROBOTS" content="NOINDEX" />
	[/#if]
	[#if page.metaDescription?has_content]
		<meta name="description" content="${page.metaDescription}" />
		<meta name="DC.description" content="${page.metaDescription}" />
	[/#if]
	[#if page.metaKeywords?has_content]
		<meta name="keywords" content="${page.metaKeywords}" />
		<meta name="DC.subject" content="${page.metaKeywords}" />
	[/#if]
	<meta name="DC.publisher" content="${publisher}" />
	<meta name="DC.creator" content="${page}" />
	<meta name="DC.date" content="${cmsfn.metaData(page, 'mgnl:lastModified')}" />
	[#local lastmod = cmsfn.metaData(page, 'mgnl:lastModified')?datetime("yyyy-MM-dd'T'HH:mm:ss.SSSXXX")]
	[#--TODO[#if contentIsStale]--]
		<meta name="contentIsStale" content="true" />
	[#--[/#if]--]
	[#--TODO <meta name="staleTimer" content="${inheritedcurrency}"/> --]
[/#macro]

[#macro sidebarmodal skipsocial=false]
	[#if cmsfn.isEditMode()]
		<div id="gato-navcolumn" class="gato-navcolumn">
  			[@cms.area name="navBlocks"/]
			<!-- social media links -->
			[#if !skipsocial]
				[@cms.area name="socialmedia" /]
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

[#macro navloop items]
	[#list items as item]
		[#if !(item.hideInNav!false)]
			[#nested item]
		[/#if]
	[/#list]
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
	<div id="breadcrumbs">
		[#if !hidetxstate]
			<a href="http://www.txstate.edu">Texas State</a>
			<span class="separator"><i class="fa fa-angle-right"></i></span>
		[/#if]
		[#-- Put the parent organization in the breadcrumbs if there is one --]
		[#if (homepage.parentOrganization)?? && cmsfn.children(homepage.parentOrganization)?size gt 0 ]
			[#local parentOrg = cmsfn.children(homepage.parentOrganization)?first]
			[#if parentOrg.parent_name?? && parentOrg.parent_name?length gt 0]
				<a href="${parentOrg.url!cmsfn.link(page)}">${parentOrg.parent_name}</a>
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
