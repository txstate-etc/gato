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
                      $Trumba.addSpud({ webName: 'txstate', spudType: 'tabchooser' });
                    </script>
                  </div>
                  <div class="column_paragraph" id="main_spud">
                    <script type="text/javascript">
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
            <div class="side_nav nav-without-title">
              <script type="text/javascript">
                $Trumba.addSpud({ webName: 'txstate', spudType: 'datefinder' });
              </script>
            </div>
            <div class="side_nav nav-without-title">
              <script type="text/javascript">
                $Trumba.addSpud({ webName: 'txstate', spudType: 'filter' });
              </script>
            </div>
          </div>
        </aside>
      </div> <!-- end of page_content -->
      [#include "/gato-template-txstate2015/templates/pages/includes/footer.ftl"]
    </div> <!-- end of the container -->
  </body>
</html>
