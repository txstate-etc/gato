[#assign socialmedianode = gf.getOrCreateArea(homepage, 'socialmedia')]
[#if gf.hasComponents(socialmedianode) || cmsfn.isEditMode()]
  <div class="side_nav nav-with-title">
    <h3 class="side_nav_header">Social Media</h3>
    <ul class="social-links side_nav_list">
      [@cms.area name="socialmedia" content=socialmedianode editable=isHomePage /]
    </ul>
  </div>
[/#if]
