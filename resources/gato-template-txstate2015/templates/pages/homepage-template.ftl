[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en-US" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    [#assign jsscripts = [
      'gato-template-txstate2015/js/jquery-scrolltofixed-min.js',
      'gato-template-txstate2015/js/respond.min.js',
      'gato-template-txstate2015/js/slideout.js',
      'gato-template-txstate2015/js/common.js'
    ]]
    [#if gf.isCacheEnvironment()]
      [#assign jsscripts = jsscripts + ['gato-template-txstate2015/js/fontsdotcom.js']]
    [/#if]
    [@templatejs scripts=jsscripts /]
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.2/fastclick.min.js"></script>

    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-txstate2015/css/txstate2015.compiled.css"/>
    [@templatehead/]

  </head>
  <body class="${cmsfn.isEditMode()?string('admin','')}">
    <nav id="menu" class="mobile_nav">
      [#import "includes/search.ftl" as search]
      [@search.searchBar true/]
      <div class="mobile_nav_container">
        <h3 class="contact_us mobile_dept"><a href="#nowhere">${gf.nodeTitle(content)}</a></h3>
        [#import "includes/mobile-menu.ftl" as menu]
        [@menu.menuBar isMobile=true/]
      </div>
      <!-- does social media need to go here -->
      <div class="mobile_super_container">
        [#include "includes/mobile-super-user.ftl"]
      </div>
    </nav>
    <div id="panel" class="container">
      <!--"super user" menu bar -->
      [#include "includes/super-user.ftl"]

      <!-- main menu -->
      <div class="top_nav">
        <!-- banner with logo and search bar -->
        [#include "includes/top-banner.ftl"]
      </div>
      
      <div class="page_content eq-parent">
        
      </div> <!-- end of page_content -->
      [#include "includes/footer.ftl"]

      <!-- legal-footer -->
      <div id="legal-footer">
            
        <div class="legal-footer-content"> 
          <div class="eq-parent">
            [#assign quickLinks = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/legal-links/quick-links', 'website'))]

            <div class="eq-mn-1-1 eq-lg-1-4">
              <div id="quick-links" class="legal-links">
                [#list cmsfn.children(quickLinks, "mgnl:component")?sort_by("text") as component]
                  <p><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></p>
                [/#list]
              </div>
            </div>
            
            [#assign requiredLinks = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/legal-links/required-links', 'website'))]
            [#assign requiredLinks = cmsfn.children(requiredLinks, "mgnl:component")]
            [#assign collen = (requiredLinks?size / 3)?ceiling]
            
            [#list requiredLinks?sort_by("text")?chunk(collen) as column]
              <div class="eq-mn-1-1 eq-lg-1-4">
                <div class="legal-links">
                  [#list column as component]
                    <p><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></p>
                  [/#list]
                </div>
              </div>
            [/#list]

          </div>

          <div class="member-statement">
            <a class="image-link" href="#nowhere">
              <img src="${ctx.contextPath}/.resources/gato-template/images/tsus-member.png"/>
            </a>
          </div>
      
        </div>  
            
      </div> <!-- end of legal-footer -->
    </div> <!-- end of the container -->
    [@cssjsmodals /]
  </body>
</html>
