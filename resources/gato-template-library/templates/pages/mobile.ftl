[#include "/gato-template/templates/includes/head.ftl"]
<!DOCTYPE html>
<html>
<head>
  [@templatejs scripts=['gato-template-library/js/searchbox.js','gato-template-library/js/mobile.js']/]
  <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-library/css/mobile.compiled.css"/>
  [@templatehead/]
</head>
<body class="${cmsfn.isEditMode()?string('admin', 'public')}">
    <div class="mobile">
        <div id="banner">
            <h1 id="banner-title">
                [@cms.area name="mobile-title"/]
            </h1>

            <div id="banner-logo" > 
                <a href="http://www.txstate.edu">
                    <img src="${gf.resourcePath()}/gato-template-library/images/texas-state-logo-iphone.png" />
                </a>
            </div>
        </div>
        <div id="banner-bar">
            <span id="banner-bar-content">
                ${model.getEvents(true)} | 
                [@cms.area name="mobile-hours-link"/]
            </span>
        </div>
        <div id="search">
            <h1>Start your research</h1>
            [#import "/gato-template-library/templates/includes/searchbox.ftl" as searchbox]
            [@searchbox.searchBox isMobile=true/]
        </div>
        <div id="quick-links">
            <span id="quick-links-content">
                [@cms.area name="mobile-quicklinks" /]
            </span>
        </div>
        <div id="nav">
            [@cms.area name="mobile-nav" contextAttributes={"bar_class":"link_add"}/]
        </div>
        <div id="news">
            <h1>News</h1>
            [@cms.area name="mobile-news" contextAttributes={"bar_class":"content_add"}/]
        </div>
        <div id="socialmedia">
            <h1>Find us on</h1>
            [@cms.area name="mobile-socialmedia" contextAttributes={"bar_class":"librarySocial_add"}/]
        </div>
        <div id="footer">
            [@cms.area name="mobile-footer" contextAttributes={"bar_class":"content_add"}/]
        </div>
        <div class="full-site-link txst-styledcontent">
            <a href="javascript: createCookie('gatoforcedesktop', 'yes'); location.reload(true);">View Full Site</a>
        </div>
    </div>
</body>
</html>