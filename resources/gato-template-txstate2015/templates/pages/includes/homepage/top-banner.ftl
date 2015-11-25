<div id="homepage-banner">
  <div class="homepage-banner-content">
    
    <div class="homepage-banner-toprow">
    
      <div class="homepage-banner-logo">
        <a href="http://www.txstate.edu">
          <img src="${ctx.contextPath}/.resources/gato-template-txstate2015/images/txst-primary.png"/>
        </a>
      </div>

      <div class="hamburger">
        <a class="toggle-button" href="#nowhere">Menu</a>
      </div>

      <div class="homepage-banner-searchwrap">
        [#import "search.ftl" as search]
        [@search.searchBar false false/]
      </div>

    </div>

    <nav class="homepage-banner-nav">
      <div class="homepage-banner-nav-content">
        
        <div class="homepage-banner-nav-logo">
          <a href="http://www.txstate.edu">
            <img src="${ctx.contextPath}/.resources/gato-template-txstate2015/images/txst-secondary.png"/>
          </a>
        </div>

        <div class="audience-link-tabs">
          <ul role="menubar">
            <li role="presentation">
                <a href="#audience-future" role="menuitem" aria-controls="audience-future" aria-selected="false" tabindex="0" id="tab-audience-future">Future Students</a>
            </li>
            <li role="presentation">
                <a href="#audience-current" role="menuitem" aria-controls="audience-current" aria-selected="false" tabindex="-1" id="tab-audience-current">Current Students</a>
            </li>
            <li role="presentation">
                <a href="#audience-facstaff" role="menuitem" aria-controls="audience-facstaff" aria-selected="false" tabindex="-1" id="tab-audience-facstaff">Faculty &amp; Staff</a>
            </li>
            <li role="presentation">
                <a href="#audience-visitors" role="menuitem" aria-controls="audience-visitors" aria-selected="false" tabindex="-1" id="tab-audience-visitors">Alumni, Family &amp; Visitors</a>
            </li>
          </ul>
        </div>

        <div class="audience-links">
          
            <!-- Future Students -->
          <div id="audience-future" class="audience-link-section" role="menu" aria-hidden="true">
            <div class="audience-link-content">

              <div class="image-block">
                <a href="#nowhere">
                  <img src="http://edelstone.github.io/gato-homepage/images/future-1.jpg"/>
                </a>
                <p class="use-garamond sub-nav-caption">
                  The crystal-clear <a class="drop-caption-link" href="https://www.flickr.com/photos/txstateu/albums/72157661036133102">San Marcos River</a> flows right through our campus, creating a unique environment for recreation and research.
                </p>
              </div>
              
              <div class="featured-links future-students">
                  
                <h3 class="sub-nav-guide">Undergraduate</h3>
                <ul>
                  <li><a href="http://www.admissions.txstate.edu/academics/undergraduate-degree-list">Majors</a></li>
                  <li><a href="http://www.admissions.txstate.edu">Admissions</a></li>
                  <li><a href="http://www.admissions.txstate.edu/apply-now">Apply</a></li>
                </ul>
                
                <h3 class="sub-nav-guide grad-guide">Graduate</h3>
                <ul>
                  <li><a href="http://www.gradcollege.txstate.edu/Prospect_Students/Pgms_Apps/Masters">Master's</a></li>
                  <li><a href="http://www.gradcollege.txstate.edu/Prospect_Students/Pgms_Apps/Doctoral">Doctorate</a></li>
                  <li><a href="http://www.gradcollege.txstate.edu/steps">Apply</a></li>
                </ul>
                
                <a class="featured-links-button" href="http://www.admissions.txstate.edu/visit">Visit Campus</a>

              </div>
              
              <div class="links-column">
                <ul>
                  <li><a href="http://www.admissions.txstate.edu/academics/areas-of-study">Areas of Study</a></li>
                  <li><a href="http://www.studyanywhere.txstate.edu">Distance and Extended Learning</a></li>
                  <li><a href="http://www.finaid.txstate.edu">Financial Aid and Scholarships</a></li>
                  <li><a href="http://www.txstate.edu/honors">Honors College</a></li>
                  <li><a href="http://www.reslife.txstate.edu">Housing and Residential Life</a></li>
                </ul>
              </div>
              
              <div class="links-column">
                <ul>
                  <li><a href="http://www.txstate.edu/internationalminds">International Programs</a></li>
                  <li><a href="http://www.rrc.txstate.edu">Round Rock Campus</a></li>
                  <li><a href="http://www.admissions.txstate.edu/future/transfer">Transfer Students</a></li>
                  <li><a href="http://www.admissions.txstate.edu/admitted/orientation">Undergraduate Orientation</a></li>
                  <li><a href="http://www.admissions.txstate.edu/visit/campus-tours">Welcome Center</a></li>
                </ul>
              </div>
            </div>
          </div>

            <!-- Current Students -->
          <div id="audience-current" class="audience-link-section" role="menu" aria-hidden="true">
            <div class="audience-link-content">

              <div class="image-block">
                <a href="#nowhere">
                  <img src="http://edelstone.github.io/gato-homepage/images/current-2.jpg"/>
                </a>
                <p class="use-garamond sub-nav-caption">
                </p>
              </div>
              
              <div class="featured-links">
                <ul>
                  <li><a href="http://advising.txstate.edu">Advising</a></li>
                  <li><a href="http://www.library.txstate.edu">Alkek Library</a></li>
                  <li><a href="http://www.bookstore.txstate.edu">Bookstore</a></li>
                  <li><a href="https://ssb.txstate.edu/prod/bwckschd.p_disp_dyn_sched">Class Schedules</a></li>
                  <li><a href="http://www.finaid.txstate.edu">Financial Aid and Scholarships</a></li>
                  <li><a href="http://www.sbs.txstate.edu">Student Business Services</a></li>
                </ul>
                
                <a class="featured-links-button" href="http://www.emergencyinfo.txstate.edu">Get Safety Alerts</a>
              </div>
              
              <div class="links-column">
                <ul>
                  <li><a href="http://www.campusrecreation.txstate.edu">Campus Recreation</a></li>
                  <li><a href="http://www.careerservices.txstate.edu">Career Services</a></li>
                  <li><a href="http://mycatalog.txstate.edu">Catalogs</a></li>
                  <li><a href="http://www.dos.txstate.edu">Dean of Students</a></li>
                  <li><a href="http://www.txstate.edu/honorcodecouncil">Honor Code</a></li>
                  <li><a href="http://www.reslife.txstate.edu">Housing and Residential Life</a></li>
                  <li><a href="http://ktsw.txstate.edu">KTSW 89.9</a></li>
                </ul>
              </div>
              
              <div class="links-column">
                <ul>
                  <li><a href="http://www.registrar.txstate.edu">Registrar</a></li>
                  <li><a href="http://studentgovernment.dos.txstate.edu">Student Government</a></li>
                  <li><a href="http://www.healthcenter.txstate.edu">Student Health Center</a></li>
                  <li><a href="http://getinvolved.lbjsc.txstate.edu/Get-Involved---CASO-Orgs">Student Organizations</a></li>
                  <li><a href="http://www.studyabroad.txstate.edu">Study Abroad</a></li>
                  <li><a href="http://www.tr.txstate.edu">Technology Resources</a></li>
                  <li><a href="http://www.va.txstate.edu">Veterans Affairs</a></li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Faculty and Staff -->
          <div id="audience-facstaff" class="audience-link-section" role="menu" aria-hidden="true">
            <div class="audience-link-content">

              <div class="image-block">
                <a href="#nowhere">
                  <img src="http://edelstone.github.io/gato-homepage/images/faculty-2.jpg"/>
                </a>
                <p class="use-garamond sub-nav-caption">
                </p>
              </div>
              
              <div class="featured-links">
                <ul>
                  <li><a href="http://www.provost.txstate.edu/colleges-departments">Academic Directory</a></li>
                  <li><a href="http://www.txstate.edu/administration">Administration</a></li>
                  <li><a href="http://www.hr.txstate.edu">Human Resources</a></li>
                  <li><a href="http://www.tr.txstate.edu">Technology Resources</a></li>
                </ul>

                <a class="featured-links-button" href="http://www.hr.txstate.edu/employment">Job Opportunities</a>
              </div>
              
              <div class="links-column">
                <ul>
                  <li><a href="http://adjunctfaculty.facultysenate.txstate.edu">Adjunct Faculty</a></li>
                  <li><a href="http://www.txstate.edu/oea">Equity and Access</a></li>
                  <li><a href="http://www.txstate.edu/facultysenate">Faculty Senate</a></li>
                  <li><a href="http://www.its.txstate.edu">Instructional Technologies</a></li>
                  <li><a href="http://www.txstate.edu/payroll">Payroll</a></li>
                  <li><a href="http://www.txstate.edu/pdevelop">Professional Development</a></li>
                  <li><a href="http://www.txstate.edu/research">Research and Grants</a></li>
                </ul>
              </div>
              
              <div class="links-column">
                <ul>
                  <li><a href="http://www.txstate.edu/rfsa">Retired Faculty and Staff</a></li>
                  <li><a href="http://www.txstate.edu/sap">SAP Resources</a></li>
                  <li><a href="http://www.staffcouncil.txstate.edu">Staff Council</a></li>
                  <li><a href="http://ssr.hr.txstate.edu">Support Staff Resources</a></li>
                  <li><a href="http://www.txstate.edu/gao/ap/travel">Travel</a></li>
                  <li><a href="http://www.txstate.edu/effective/upps/">University Policies</a></li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Alumni, et al. -->
          <div id="audience-visitors" class="audience-link-section" role="menu" aria-hidden="true"> 
            <div class="audience-link-content">

              <div class="image-block">
                <a href="#nowhere">
                  <img src="http://edelstone.github.io/gato-homepage/images/alumni-1.jpg"/>
                </a>
                <p class="use-garamond sub-nav-caption">
                </p>
              </div>
              
              <div class="featured-links">
                <ul>
                  <li><a href="http://alumni.txstate.edu">Alumni Association</a></li>
                  <li><a href="http://www.txstatebobcats.com">Athletics</a></li>
                  <li><a href="http://www.txstate.edu/commencement">Commencement</a></li>
                  <li><a href="http://www.registrar.txstate.edu/our-services/transcriptsCR">Transcripts</a></li>
                </ul>

                <a class="featured-links-button" href="http://www.ua.txstate.edu">Make a Gift<i class="fa fa-gift"></i></a>
              </div>
              
              <div class="links-column">
                <ul>
                  <li><a href="http://www.txstatebobcats.com/schedule.aspx?path=football&amp;">Bobcat Football</a></li>
                  <li><a href="http://www.fss.txstate.edu/planning/fac_pln/construction">Campus Construction</a></li>
                  <li><a href="http://www.txstate.edu/community">Community Relations</a></li>
                  <li><a href="http://www.maps.txstate.edu/driving_maps">Driving Directions and Maps</a></li>
                  <li><a href="http://www.ua.txstate.edu/campus-connections/family-association">Family Association</a></li>
                </ul>
              </div>
              
              <div class="links-column">
                <ul>                           
                  <li><a href="http://www.finearts.txstate.edu/friends">Friends of Fine Arts</a></li>
                  <li><a href="http://www.ua.txstate.edu/campus-connections/hillviews">Hillviews Magazine</a></li>
                  <li><a href="http://www.parentandfamily.txstate.edu">Parent and Family Relations</a></li>
                  <li><a href="http://www.president.txstate.edu">President</a></li>
                  <li><a href="http://www.thewittliffcollections.txstate.edu">Wittliff Collections</a></li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      
      </div>
    </nav>

  </div>
</div>
