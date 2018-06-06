[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-trumba/css/standard.scss"/>
    [@templatejs scripts=[
    ]/]
    <script type="text/javascript" src="http://www.trumba.com/scripts/spuds.js"></script>
    [@templatehead/]
  </head>

  <body>
    [@skipnav/]
    <div id="panel" class="container">
      [#include "/gato-template-txstate2015/templates/pages/includes/top-banner.ftl"]

      <div class="header_no_image txstate-dept-title">
        <div class="title">
          <div class="dept_name">
            <!-- TODO: don't hardcode the event url -->
            <a class="parent_org" href="${gf.filterUrl('//events.txstate.edu')}">Texas State University</a>
            <span class="office_name"><a href="#">TODO: Add Calendar Title Here</a></span>
          </div>
        </div>
      </div>

      <div class="trail">
        [@breadcrumbs/]
      </div>

      <div class="page_content">
        <main class="contentcolumn">
          [@headline hideSidebar /]
          <div class="gato-section-full">
            <div class="gato-section-centered">
              <div class="gato-section eq-parent">
                <div class="layout-column full eq-parent">
                  <div class="column_paragraph" id="main_spud">
                    <script type="text/javascript">
                      $Trumba.addSpud({ webName: 'txstate', spudType: 'tabchooser' });
                      $Trumba.addSpud({ webName: 'txstate', spudType: 'main' });
                    </script>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <aside class="sidebar-container">
          <div class="sidebar">
            <script type="text/javascript">
              $Trumba.addSpud({ webName: 'txstate', spudType: 'datefinder' });
              $Trumba.addSpud({ webName: 'txstate', spudType: 'filter' });
            </script>
          </div>
        </aside>
      </div> <!-- end of page_content -->
      [#include "/gato-template-txstate2015/templates/pages/includes/footer.ftl"]
    </div> <!-- end of the container -->
  </body>
</html>
