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
        <a class="image_link" href="http://www.txstate.edu">
          <!--[if lt IE 9]>
          <img alt="Texas State University - The Rising Star of Texas" src="${ctx.contextPath}/.resources/gato-template-txstate2015/images/txst_logo.png">
          <![endif]-->
          <!--[if gte IE 9]>
          <img alt="Texas State University - The Rising Star of Texas" src="${ctx.contextPath}/.resources/gato-template-txstate2015/images/txst_logo.svg">
          <![endif]-->
        </a>
      </div>
    </div>
    <div class="footer_column footer_column_3">
      [@cms.area name="footerLinks" content=gf.getOrCreateArea(homepage, 'footerLinks') editable=isHomePage/]
    </div>
  </div> <!-- footer_content -->
</div> <!-- footer -->
