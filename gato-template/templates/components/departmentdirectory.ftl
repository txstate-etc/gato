[#include "/gato-template/templates/includes/component.ftl"]

[@templatecomponent]
    [#if content.title??]
            <h2>${content.title}</h2>
    [/#if]
    <div class="txst-departmentdirectory object">
        [#list gf.getPeople(content.department) as person]
            [#assign showRecord = true]
            [#if person.category == "Retired"]
                [#assign showRecord = false]
            [#else]
                [#if content.filter != "All" && content.filter !=person.category]
                    [#assign showRecord = false]
                [/#if]
            [/#if] 
            [#if showRecord]
                <div class="txst-departmentdirectory-entry vcard row clearfix">
                    <div class="txst-departmentdirectory-name fn n column col-xs-1 col-sm-1-2 col-md-1-3 col-lg-1-6">
                        <span class="given-name">${person.firstname}</span>
                        <span class="family-name">${person.lastname}</span>
                        &nbsp;
                    </div>
                    <div class="txst-departmentdirectory-title column col-xs-1 col-sm-1-2 col-md-1-3 col-lg-1-6">
                        ${person.title} 
                        &nbsp;
                    </div>
                    <div class="txst-departmentdirectory-email email column col-xs-1 col-sm-1-2 col-md-1-3 col-lg-1-6">
                        <a href="mailto:${person.email}">${person.email}</a>
                        &nbsp;
                    </div>
                    <div class="txst-departmentdirectory-phone tel column col-xs-1 col-sm-1-2 col-md-1-3 col-lg-1-6">
                        ${person.phone} 
                        &nbsp;
                    </div>
                   <!-- <div class="txst-departmentdirectory-extra2"></div> -->
                    
                    <div class="txst-departmentdirectory-address street-address column col-xs-1 col-sm-1-2 col-md-1-3 col-lg-1-6">
                        ${person.address}
                        &nbsp;
                    </div> 
                    <div class="txst-departmentdirectory-category column col-xs-1 col-sm-1-2 col-md-1-3 col-lg-1-6">
                        ${person.category}
                        &nbsp;
                    </div>
                 <!--   <div class="txst-departmentdirectory-extra1"></div> -->
                </div>
            [/#if]
        [/#list]
    </div>
    
[/@templatecomponent]