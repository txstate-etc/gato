[#include "/gato-template/templates/includes/head.ftl"]
[#assign isMainCalendar = (content.calendar == '1400280')]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    [@googletagmanager /]
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-trumba/css/standard.scss"/>
    [@templatejs scripts=['gato-template-trumba/js/trumba.js'
    ]/]
    <script type="text/javascript" src="//www.trumba.com/scripts/spuds.js"></script>
    [@templatehead/]
  </head>

  <body>
    [@skipnav/]
    [@googletagmanagerbody /]
    <div id="panel" class="container">
      [#include "/gato-template-txstate2015/templates/pages/includes/top-banner.ftl"]

      <div class="header_no_image txstate-dept-title">
        <div class="title">
          <div class="dept_name">
            <a class="parent_org" href="${cmsfn.link(homepage)}">Texas State University</a>
            <span class="office_name"><a href="#">[@pagetitle content /]</a></span>
          </div>
        </div>
      </div>

      <div class="trail">
        [@breadcrumbs/]
      </div>

      <div class="page_content">
        <main class="contentcolumn">
          <div class="gato-section-full">
            <div class="gato-section-centered">
              <div class="gato-section eq-parent">
                <div class="layout-column full eq-parent">
                  <div class="column_paragraph" id="main_spud">
                    <script type="text/javascript">
                      addTrumbaSpud({webName:'calendar.${content.calendar}', spudType:'tabchooser'});
                    </script>
                  </div>
                  <div class="column_paragraph" id="main_spud">
                    <script type="text/javascript">
                      [#if isMainCalendar]
                        addTrumbaSpud({ webName: 'calendar.${content.calendar}', spudType: 'main', url: { filterview: "Exclude Long Exhibits" } });
                      [#else]
                        addTrumbaSpud({ webName: 'calendar.${content.calendar}', spudType: 'main' });
                      [/#if]
                    </script>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <aside class="sidebar-container">
          <div class="sidebar">
            [#if isMainCalendar]
              <div class="side_nav nav-without-title">
                <script type="text/javascript">
                  addTrumbaSpud({ webName: 'calendar.${content.calendar}', spudType: 'eventslider', spudConfig: 'ExhibitionSlider', url: { filterview: "Long Exhibits Only" } });
                </script>
              </div>
            [/#if]
            <div class="side_nav nav-without-title">
              <script type="text/javascript">
                addTrumbaSpud({ webName: 'calendar.${content.calendar}', spudType: 'datefinder' });
              </script>
            </div>
            [#if content.code?hasContent]
            <div class="side_nav nav-without-title">
              <button class="btn-submit-event">Submit Event</button>
            </div>
            [/#if]
            <div class="side_nav nav-without-title">
              <script type="text/javascript">
                addTrumbaSpud({ webName: 'calendar.${content.calendar}', spudType: 'searchlabeled' });
              </script>
            </div>
            <div class="side_nav nav-without-title">
              <script type="text/javascript">
                [#if isMainCalendar]
                  addTrumbaSpud({ webName: 'calendar.${content.calendar}', spudType: 'filter', url: { filterview: "Exclude Long Exhibits" } });
                [#else]
                  addTrumbaSpud({ webName: 'calendar.${content.calendar}', spudType: 'filter' });
                [/#if]
              </script>
            </div>
          </div>
        </aside>
      </div> <!-- end of page_content -->
      <footer class="footer">
        <div class="footer_content">
          <div class="footer_column footer_column_1">
            <div class="social-tagline">Connect with Us:</div>
            <div class="social-icons">
              [@cms.area name="socialmedia" contextAttributes={"icononly": true}/]
            </div>
          </div>
          <div class="footer_column footer_column_2">
            <div class="txst_logo">
              <a class="image_link" href="http://www.txstate.edu">
                <!--[if lt IE 9]>
                <img alt="Texas State University - The Rising Star of Texas" src="${gf.resourcePath()}/gato-template-txstate2015/images/txst_logo.png">
                <![endif]-->
                <!--[if gte IE 9]><!-->
                <img alt="Texas State University - The Rising Star of Texas" src="${gf.resourcePath()}/gato-template-txstate2015/images/txst_logo.svg">
                <!--<![endif]-->
              </a>
            </div>
          </div>
          <div class="footer_column footer_column_3">
            <a class="apply_now about_txstate" href="http://www.txstate.edu/about">About Texas State</a>
          </div>
        </div>
      </footer>
    </div> <!-- end of the container -->
    <div id="submit-event-modal">
    <button class="btn-close-modal">Close</button>
    <script id="trumbaSubmitEventJS" type="text/javascript" src="//www.trumba.com/ea/scripts/submitevent.js"></script>
    <script type="text/javascript">trumbaInsertSubmitEventForm({
    code: "${content.code!}",
    width: 385,
    height: 775,
    backgroundColor: "white" });
    </script>
    </div>
    <script type="text/javascript">
      var eventSubmissionModal = new modal($('submit-event-modal'));
    </script>
  </body>
</html>
