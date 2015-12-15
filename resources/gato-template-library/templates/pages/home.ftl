[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html>
<head>
  [@templatejs scripts=['gato-template-library/js/searchbox.js',
                        'gato-template-library/js/library.js',
                        'gato-template-tsus/js/tsus-slideshow.js',
                        'gato-template-txstate2015/js/jquery-scrolltofixed-min.js']/]
  <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-library/css/library.compiled.css" crossorigin="use-credentials"/>
  <link href="http://fonts.googleapis.com/css?family=Ubuntu+Condensed" rel="stylesheet" type="text/css" />
  [@templatehead /]
</head>
<body id="library-2012" class="${cmsfn.isEditMode()?string('admin', 'public')}">

    <!--"super user" menu bar -->
    [#include "../../../gato-template-txstate2015/templates/pages/includes/super-user.ftl"]
    <!-- banner with logo and search bar -->
    [#include "../../../gato-template-txstate2015/templates/pages/includes/top-banner.ftl"]
    <!--header image, parent organization, department name -->
    [#include "../../../gato-template-txstate2015/templates/pages/includes/header.ftl"]
    <!-- main menu -->
    <div class="top_nav">
        [@mainmenu textmenu=true /]
    </div>
    <div class="txst-khan-frame">
        <h1 class="visuallyhidden" id="maincontent" tabindex="-1">${content.title}</h1>
        <div class="slideshow-bg">
            [@cms.area name="slideshow"/]
            <div class="library-hours">
                [@cms.area name="emergency-hours"/]
                <h3>Library Hours Today</h3>
                ${model.getEvents(false)}
                <div class="hours">
                    <h5>All Hours</h5>
                    <div class="all-hours">
                        [@cms.area name="library-allhours" contextAttributes={"bar_class":"imageLink_add"}/]
                    </div>
                </div>
                <div class="hours-links">
                    [@cms.area name="library-hourslinks" /]
                </div>
            </div>
        </div>
        [@cms.area name="emergency-general"/]
        [#import "/gato-template-library/templates/includes/searchbox.ftl" as searchbox]
        [@searchbox.searchBox isMobile=false/]
        <div class="quick-links">
            <div class="left">
                <div class="header">
                    Quick Links
                </div>
                [@cms.area name="library-quicklinks" contextAttributes={"bar_class":"link_add"}/]
            </div>
            <div class="right">
                <div class="header">
                    Services For
                </div>
                [@cms.area name="library-services" contextAttributes={"bar_class":"link_add"} /]
            </div>
        </div>
        <div class="social">
            [@cms.area name="socialmedia" contextAttributes={"icononly": true}/]
            <div class="button">
                [@cms.area name="support-button" /]
            </div>
        </div>
        <div class="content-boxes">
            <div class="content-box left">
                <h3 class="button">News</h3>
                [@cms.area name="contentboxleft" contextAttributes={"bar_class":"content_add"} /]
            </div>
            <div class="content-box middle">
                <h3 class="button">Events</h3>
                [@cms.area name="contentboxmiddle" /]
            </div>
            <div class="content-box right">
                <h3 class="button">Your Library</h3>
                [@cms.area name="contentboxright"  contextAttributes={"bar_class":"content_add"}/]
            </div>
        </div>
        <div class="library-footer">
            [@cms.area name="library-footer" contextAttributes={"bar_class":"link_add"}/]
        </div>
        <div class="more-footer">
            <div class="txst-footer">
                [@cms.area name="footer"/]
            </div>
        </div>
    </div>
    [@cssjsmodals /]
    [@sidebarmodal /]
    [#if cmsfn.isEditMode()]
        <div id="gato-mobile-edit-modal" class="gato-custom-column">
            [#include "mobile.ftl"]
            <script type="text/javascript">
                var cssmodal = new modal($('gato-mobile-edit-modal'));
                cssmodal.addToMainbar('Edit Mobile Template');
            </script>
        </div>
    [/#if]
</body>
</html>
