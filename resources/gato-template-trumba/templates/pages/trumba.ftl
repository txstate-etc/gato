[#include "/gato-template/templates/includes/head.ftl"]
[#assign isMainCalendar = (content.calendar == '1400280')]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    [@googletagmanager /]
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-trumba/css/standard.scss"/>
    [@templatejs scripts=['gato-template-trumba/js/trumba.js',
                          'gato-template-mobilefirst/js/footer.js',
                          'gato-template-mobilefirst/js/menu.js',
                          'gato-template-mobilefirst/js/mobilefirst.js'
    ]/]
    <script type="text/javascript" src="//www.trumba.com/scripts/spuds.js"></script>
    [@templatehead/]
  </head>
  <body>
    [@skipnav/]
    [@googletagmanagerbody /]
    [#include "/gato-template-mobilefirst/templates/pages/includes/header.ftl"]
    [#include "/gato-template-mobilefirst/templates/pages/includes/menu.ftl"]
    <div class="page-container" id="panel">
      [@cms.area name="organization-info" content=gf.getOrCreateArea(homepage, 'organization-info') editable=isHomePage contextAttributes={"isHome":def.parameters.isFeatureTemplate!false, "hasImage":false}/]
      <div class="gato-section-full">
        <div class="gato-section-centered">
          <div class="gato-section">
            [@breadcrumbs/]
          </div>
        </div>
      </div>
      <div class="main-content">
        <main class="contentcolumn ${content.intro?has_content?then('', 'no-intro')}">
          <h1 id="maincontent" class="visuallyhidden">${gf.nodeTitle(content)}</h1>
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
        <aside>
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
            [#if content.code?has_content]
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
            <ul class="side_nav nav-without-title calendar-util">
              <li><a href="http://events.txstate.edu/admin">Admin Login</a></li>
              <li><a href="http://universityevents.its.txstate.edu/">Calendar Support</a></li>
              <li><a href="http://universityevents.its.txstate.edu/request-forms/request-calendar.html">Request a Calendar</a></li>
            </ul>
          </div>
        </aside>
      </div>
      [#include "/gato-template-mobilefirst/templates/pages/includes/footer.ftl"]
    </div>
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