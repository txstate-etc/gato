[#include "/gato-template/templates/includes/component.ftl"]

[@templatecomponent]
    [#if content.title??]
            <h2>${content.title}</h2>
    [/#if]
    <div class="txst-departmentdirectory object">
        [#list model.getPeople(content.department) as person]
            [#assign showRecord = true]
            [#if person.category == "Retired"]
                [#assign showRecord = false]
            [#else]
                [#if content.filter != "All" && content.filter !=person.category]
                    [#assign showRecord = false]
                [/#if]
            [/#if] 
            [#if showRecord]
                <div class="txst-departmentdirectory-entry vcard row clearfix eq-parent">
                    <div class="txst-departmentdirectory-name fn n eq-md-1-1 eq-xs-1-1 eq-mn-1-1 eq-lg-1-5">
                        <span class="given-name">${person.firstname}</span>
                        <span class="family-name">${person.lastname}</span>
                        -
                        ${person.category}
                        &nbsp;
                    </div>
                    <div class="txst-departmentdirectory-title eq-md-1-2 eq-xs-1-1 eq-mn-1-1 eq-lg-1-5">
                        ${person.title} 
                        &nbsp;
                    </div>
                    <div class="txst-departmentdirectory-address street-address eq-md-1-2 eq-xs-1-1 eq-mn-1-1 eq-lg-1-5">
                        ${person.address}
                        &nbsp;
                    </div> 
                     <div class="txst-departmentdirectory-phone tel eq-md-1-2 eq-xs-1-1 eq-mn-1-1 eq-lg-1-5">
                     <span class="dd-icon"><i class="fa fa-phone"></i></span>
                        ${person.phone} 
                        &nbsp;
                    </div>
                    <div class="txst-departmentdirectory-email email eq-md-1-2 eq-xs-1-1 eq-mn-1-1 eq-lg-1-5">
                        <span class="dd-icon"><i class="fa fa-envelope"></i></span>
                        <a href="mailto:${person.email}">${person.email}</a>
                        &nbsp;
                    </div>        
                </div>
            [/#if]
        [/#list]
    </div>
    
[/@templatecomponent]