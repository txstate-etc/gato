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

            <div class="eq-mn-1-1 eq-md-1-4">
              <div id="quick-links" class="legal-links">
                <p><a href="#nowhere">Bobcat Shuttle</a></p>
                <p><a href="#nowhere">Campus Plans</a></p>
                <p><a href="#nowhere">Campus Carry</a></p>
                <p><a href="#nowhere">EEO Statement</a></p>
                <p><a href="#nowhere">History and Traditions</a></p>
                <p><a href="#nowhere">Mission and Goals</a></p>
                <p><a href="#nowhere">Research and Commercialization</a></p>
                <p><a href="#nowhere">University Data Sets</a></p>
              </div>
            </div>
          
            <div class="eq-mn-1-1 eq-md-1-4">
              <div id="legal-links-1" class="legal-links">
                <p><a href="#nowhere">Accessibility Coordinator</a></p>
                <p><a href="#nowhere">Clery Act</a></p>
                <p><a href="#nowhere">College Portrait</a></p>
                <p><a href="#nowhere">Committee on People with Disabilities</a></p>
                <p><a href="#nowhere">Compact with Texans</a></p>
                <p><a href="#nowhere">Consumer Information</a></p>
                <p><a href="#nowhere">Copyright Infringement</a></p>
                <p><a href="#nowhere">Course Info and Faculty CV (HB 2504)</a></p>
              </div>
            </div>
        
            <div class="eq-mn-1-1 eq-md-1-4">
              <div id="legal-links-2" class="legal-links">
                <p><a href="#nowhere">Disability Services Policy</a></p>
                <p><a href="#nowhere">Freeman Ranch Drinking Water Report</a></p>
                <p><a href="#nowhere">Institutional Resumes</a></p>
                <p><a href="#nowhere">Link Policy</a></p>
                <p><a href="#nowhere">Office of Disability Services</a></p>
                <p><a href="#nowhere">Open Records</a></p>
                <p><a href="#nowhere">Privacy Statement</a></p>
                <p><a href="#nowhere">State Accessibility Standards</a></p>
              </div>
            </div>
          
            <div class="eq-mn-1-1 eq-md-1-4">
              <div id="legal-links-3" class="legal-links">
                <p><a href="#nowhere">State Fraud Hotline</a></p>
                <p><a href="#nowhere">State of Texas</a></p>
                <p><a href="#nowhere">Statewide Search</a></p>
                <p><a href="#nowhere">Texas CREWS</a></p>
                <p><a href="#nowhere">Texas Homeland Security</a></p>
                <p><a href="#nowhere">Texas State Drinking Water Report</a></p>
                <p><a href="#nowhere">Texas Veterans Portal</a></p>
                <p><a href="#nowhere">TSUS Compliance and Ethics</a></p>
              </div>
            </div>
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
