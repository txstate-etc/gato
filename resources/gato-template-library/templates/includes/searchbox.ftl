[#macro searchBox isMobile]
<div class="search-box">
    [#if !isMobile]
        <ul class="search-box-tabs">
            <li class="starttab selected"><a href="#tab1">Start Your Research</a></li>
            <li class="articletab"><a href="#tab2">Articles</a></li>
            <li class="booktab"><a href="#tab3">Books &amp; More</a></li>
            <li class="journaltab"><a href="#tab4">Periodicals</a></li>
            <li class="reservetab"><a href="#tab5">Reserves</a></li>
            <li class="guidetab"><a href="#tab6">Research &amp; Course Guides</a></li>
        </ul>
    [/#if]
    <div class="search-box-content">

        <!-- ALL RESOURCES -->
        <div id="tab1" class="selected">
            <!-- Begin form which will construct a persistent link into EDS
            http://support.epnet.com/knowledge_base/detail.php?id=2747#linksearch
            -->
            <form action="http://libproxy.txstate.edu/form?qurl=http%3a%2f%2fsearch.ebscohost.com%2flogin.aspx" method="post" target="_blank" onSubmit="ebscoPreProcess(this)">
                <!-- Script needs to prepend the selected value below to the user's search term -->
                <span class="search-type-fields">
                    <label for="search_prefix">Search by</label>
                    <select size="1" name="search_prefix">
                        <option selected="selected" value="">Keyword</option>
                        <option value="TI ">Title</option>
                        <option value="AU ">Author</option>
                    </select>
                </span>

                <input type="hidden" name="direct" value="true" />
                <input type="hidden" name="scope" value="site" />
                <!-- target an EDS profile -->
                
                <input type="hidden" name="site" value="eds-live" />
                <input type="hidden" name="profile" value="edslive" />
                
                <!-- Auth type is ID/PW  -->
                <input type="hidden" name="authtype" value="cookie,ip,uid" />
                <!-- Full text limiter... use some script to have the check box set this value to Y -->
                <input type="hidden" name="cli0" value="FT" />
                <input type="hidden" name="clv0" value="N" />
                
                <!-- search box and submit button -->
                <input name="bquery" type="hidden" value="" />
                
                [#if isMobile] 
                    <div id='search-text-box'>
                        <input id='search-text' name="uquery" type="search" placeholder="Search Articles/Books/Media"/>
                        <input id='search-button' type="submit" value="Search" />
                    </div>
                [#else]
                    <input class="query" name="uquery" type="text" size="23" value="Search Articles/Books/Media"/>
                    <input type="image" class="searchimg" alt="Search" src="${gf.resourcePath()}/gato-template-library/images/searchArrow.png" />
                [/#if]
                
                [#if !isMobile]
                    <div class="extra-options">
                        <!-- Full text...use some script to have the check box set the above value to Y, or alternatively you can have script append FT Y to the users search -->
                        <input type="checkbox" name="fulltext_checkbox" id="fulltext_checkbox_all" onClick="limittoFullText(this.form)"/> <label for="fulltext_checkbox_all">Full-Text  (Online)</label>
                    </div>
                    <div class="shortdesc">
                        [@cms.area name="start-description"/]
                    </div>
                [/#if]
            </form>
        </div>
        
        [#if !isMobile]
            <!-- EDS ARTICLES ONLY-->
            <div id="tab2">
                <!-- Begin form which will construct a persistent link into EDS
                http://support.epnet.com/knowledge_base/detail.php?id=2747#linksearch
                -->
                <form action="http://libproxy.txstate.edu/form?qurl=http%3a%2f%2fsearch.ebscohost.com%2flogin.aspx" method="post" target="_blank" onSubmit="ebscoPreProcess(this); limittoArticles(this)">
                
                    <!-- Script needs to prepend the selected value below to the user's search term -->
                    <select size="1" name="search_prefix">
                        <option selected="selected" value="">Keyword</option>
                        <option value="TI ">Title</option>
                        <option value="AU ">Author</option>
                    </select>
                    
                    <input type="hidden" name="direct" value="true" />
                    <input type="hidden" name="scope" value="site" />
                    
                    <!-- target an EDS profile -->
                    <input type="hidden" name="site" value="eds-live" />
                    <input type="hidden" name="profile" value="edslive" />
                    
                    <!-- Auth type   -->
                    <input type="hidden" name="authtype" value="cookie,ip,uid" />
                    
                    <!-- Scholarly/Peer-reviewed limiter... use some script to have the check box set this value to Y -->
                    <input type="hidden" name="cli1" value="RV" />
                    <input type="hidden" name="clv1" value="N" />
                    
                    <!-- Full text limiter... use some script to have the check box set this value to Y -->
                    <input type="hidden" name="cli0" value="FT" />
                    <input type="hidden" name="clv0" value="N" />
                    
                    <!-- search box and submit button -->
                    <input name="bquery" type="hidden" value="" />
                    <input class="query" name="uquery" type="text" size="23"  value="Search Articles"/>
                    
                    <!-- Since we only want Articles in this tab, we need to append ' AND ZT Article' to the user's search entry -->
                    
                    <input type="image" class="searchimg" alt="Search" src="${gf.resourcePath()}/gato-template-library/images/searchArrow.png" />
                    <div class="extra-options">
                        <!-- Full text... use some script to have the check box set the above values to Y -->
                        <input type="checkbox" name="fulltext_checkbox" id="fulltext_checkbox_articles" onclick="limittoFullText(this.form)"/> <label for="fulltext_checkbox_articles">Full-Text (Online)</label> &nbsp;
                        <input type="checkbox" name="scholarly_checkbox" id="scholarly_checkbox_articles" onclick="limittoScholarly(this.form)"/> <label for="scholarly_checkbox_articles">Scholarly/Peer-Reviewed</label>
                    </div>
                    <div class="shortdesc">
                    [@cms.area name="articles-description" /]
                    </div>
                </form>
            </div>
            
            <!-- BOOKS -->
            <div id="tab3">
                <form id="booksearch" action="http://catalog.library.txstate.edu/search/a?a" method="post" target="_blank" name="search">
                    <select name="searchtype">
                        <option value="X" selected="selected">Keyword</option>
                        <option value="t">Title</option>
                        <option value="a">Author</option>
                        <option value="d">Subject</option>
                        <option value="c">Call Number</option>
                    </select>
                    <input class="query" name="searcharg" type="text"  value="Search Books/Media"/>
                    <input type="image" class="searchimg" alt="Search" src="${gf.resourcePath()}/gato-template-library/images/searchArrow.png" />
                    <div class="extra-options">
                        <input type="radio" name="searchscope" id="searchscope1" value="1" checked="checked"/> <label for="searchscope1">All</label>&nbsp;
                        <input type="radio" name="searchscope" id="searchscope3" value="3" /> <label for="searchscope3">Books</label>&nbsp;
                        <input type="radio" name="searchscope" id="searchscope4" value="4" /> <label for="searchscope4">E-Books</label>&nbsp;
                        <input type="radio" name="searchscope" id="searchscope2" value="2" /> <label for="searchscope2">Audiobooks</label>&nbsp;
                        <input type="radio" name="searchscope" id="searchscope16" value="16" /> <label for="searchscope16">Video</label>&nbsp;
                        <input type="radio" name="searchscope" id="searchscope10" value="10"/> <label for="searchscope10">Music</label>
                        <input type="hidden" name="SORT" value="DX" />
                    </div>
                    <div class="shortdesc">
                    [@cms.area name="books-description" /]
                    </div>
                </form>
            </div>
            
            <!-- Journals -->
            <div id="tab4">
                <!--Start of advanced A-to-Z Search -->
                <form action="http://atoz.ebsco.com/titles.asp" method="get" target="_blank" name="frmAdvSearch">
                    <select name="SF">
                        <option value="Titles" selected="selected">Journal Title</option>
                        <option value="ISSN">ISSN</option>
                        <option value="Publishers">Publisher</option>
                    </select>
            
                    <input class="query" name="KW" type="text" value="Search Periodicals"/>
                    <!-- NOTE: 3402 is our A-to-Z Customer Code -->
                    <input type="hidden" name="id" value="3402" />
                    <input type="hidden" name="linktype" value="search" />
                    <!--input type="submit" name="cmdSearchSubmit" value="Search" /-->
                    <input type="image" class="searchimg" alt="Search" src="${gf.resourcePath()}/gato-template-library/images/searchArrow.png" />
                    
                    <div class="extra-options">
                        <!-- NOTE: Change default selection by moving CHECKED to the desired input tag -->
                        <input id="Contains" type="radio" checked="checked" name="ST" value="Contains" /> <label for="Contains">Contains</label>&nbsp;
                        <input id="Begins" type="radio" name="ST" value="Begins" /> <label for="Begins">Begins With</label> &nbsp;
                        <input id="Exact" type="radio" name="ST" value="Exact" /> <label for="Exact">Exact Match</label>
                    </div>
            
                    <div class="shortdesc">
                        [@cms.area name="journals-description" /]
                    </div>
                </form>
            </div>
                
            <!-- RESERVE -->
            <div id="tab5">
                <form id="reservesearch" action="#" method="post" target="_blank" name="search" onSubmit="processReserve(this)">
                    <select name="searchtype">
                        <option value="r" selected="selected">Course</option>
                        <option value="p">Instructor</option>
                    </select>
                    <input name="key" type="hidden" value="abbreviation&amp;number"/>
                    <input name="search" type="hidden" value=""/>
                    <input class="query" name="searcharg" type="text" value="Search Reserves" />
                    <input type="image" class="searchimg" alt="Search" src="${gf.resourcePath()}/gato-template-library/images/searchArrow.png" />
                    <div class="extra-options">
                        <input type="radio" name="reservetype" id="reservetypeprint" value="print" checked="checked"/> <label for="reservetypeprint">Print Reserve</label>
                        &nbsp;&nbsp; <input type="radio" name="reservetype" id="reservetypeelectronic" value="electronic"/> <label for="reservetypeelectronic">E-Reserve</label>
                    </div>
                    <div class="shortdesc">
                    [@cms.area name="reserve-description" /]
                    </div>
                </form>
            </div>
            
            <!-- RESEARCH GUIDES -->
            <div id="tab6">
                <form id="lg_search_form" method="GET" target="_blank" action="http://guides.library.txstate.edu/sch.php?">
                    <span class="query_label">Library Guides: </span>
                    <input type="hidden" name="gid" value="0"/>
                    <input type="text" class="query" name="q" id="lg_search_box" value="Search for subject or course guides"/>
                    <input type="image" class="searchimg" alt="Search" src="${gf.resourcePath()}/gato-template-library/images/searchArrow.png" />
                    <div class="extra-options">
                        <jsp:text/>
                    </div>
                    <div class="shortdesc">
                    [@cms.area name="libguides-description" /]
                    </div>
                </form>
            </div>
        [/#if]
    </div>
    <!-- put chatlink here -->
</div>
[/#macro]