[#include "/gato-template/templates/includes/component.ftl"]

[@templatecomponent]
    [#if content.title??]
            <h2>${content.title}</h2>
    [/#if]
    <ul class="txst-departmentdirectory object">
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
                <li class="txst-departmentdirectory-entry vcard">
                    <div class="txst-departmentdirectory-name fn n">
                        <span class="given-name">${person.firstname}</span>
                        <span class="family-name">${person.lastname}</span>
                        &nbsp;
                    </div>
                    <div class="txst-departmentdirectory-email email">
                        <a href="mailto:${person.email}">${person.email}</a>
                        &nbsp;
                    </div>
                    <div class="txst-departmentdirectory-phone tel">
                        ${person.phone} 
                        &nbsp;
                    </div>
                    <div class="txst-departmentdirectory-extra2"></div>
                    <div class="txst-departmentdirectory-title title">
                        ${person.title} 
                        &nbsp;
                    </div>
                    <div class="txst-departmentdirectory-address street-address">
                        ${person.address}
                        &nbsp;
                    </div> 
                    <div class="txst-departmentdirectory-category">
                        ${person.category}
                        &nbsp;
                    </div>
                    <div class="txst-departmentdirectory-extra1"></div>
                </li>
            [/#if]
        [/#list]
    </ul>
    
[/@templatecomponent]