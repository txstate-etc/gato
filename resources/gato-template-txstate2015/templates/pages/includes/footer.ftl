<div class="footer row">
  <div class="footer_content">
    <a href="#" class="btt"><i class="fa fa-chevron-up"></i>Top</a>
    <div class="footer_column footer_column_1">
      <h3 class="contact_us">
        <a href="${cmsfn.link(homepage)}">${gf.nodeTitle(homepage)}</a>
      </h3>
      <div class="dept_info">
        [@cms.area name="siteinfo" content=gf.getOrCreateArea(homepage, 'siteinfo') editable=isHomePage/]
      </div>
    </div>
    <div class="footer_column footer_column_2" >
      <div class="txst_logo">
        <a class="image_link" href="http://www.txstate.edu"><img alt="Texas State University - The Rising Star of Texas" src="${ctx.contextPath}/.resources/gato-template-txstate2015/images/txst_logo.svg"></a>
      </div>
    </div>
    <div class="footer_column footer_column_3">
      <ul class="foot_linkage">
        [#list cmsfn.children(globalLinks.footerLinks, "mgnl:component") as component ]
          <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
        [/#list]
      </ul>
      <a class="apply_now" href="http://www.txstate.edu/admissions#apply">Apply Now</a>
    </div>
  </div> <!-- footer_content -->
</div> <!-- footer -->
