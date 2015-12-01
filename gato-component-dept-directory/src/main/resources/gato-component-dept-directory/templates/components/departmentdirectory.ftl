[#macro directoryEntry person]
    [#if !(person?is_string)]
        <div class="txst-departmentdirectory-entry vcard">
            <div class="txst-departmentdirectory-name fn n">
                <span class="given-name">${person.firstname}</span>
                <span class="family-name">${person.lastname}</span>
                -
                ${person.category}
                &nbsp;
            </div>
            <div class="txst-departmentdirectory-title">
                ${person.title} 
                &nbsp;
            </div><div class="txst-departmentdirectory-address street-address">
                ${person.address}
                &nbsp;
            </div> 
             <div class="txst-departmentdirectory-phone tel">
             <span class="dd-icon"><i class="fa fa-phone"></i></span>
                ${person.phone} 
                &nbsp;
            </div><div class="txst-departmentdirectory-email email">
                <span class="dd-icon"><i class="fa fa-envelope"></i></span>
                <a href="mailto:${person.email}">${person.email}</a>
                &nbsp;
            </div>        
        </div>
    [/#if]
[/#macro]

[#if content.title??]
        <h2>${content.title}</h2>
[/#if]
[#assign filter = 'All']
[#if content.filter??]
    [#assign filter = content.filter]
[/#if]
<div class="txst-departmentdirectory object eq-parent">
    [#list model.getPeople(content.department) as person]
        [#assign showRecord = true]
        [#if person.category == "Retired"]
            [#assign showRecord = false]
        [#else]
            [#if filter != "All" && filter !=person.category]
                [#assign showRecord = false]
            [/#if]
        [/#if]
        [#if showRecord]
            [@compress single_line=true]
            <div class="directory-row eq-ml-1-2 eq-lg-1-3">
                [@directoryEntry person /]
            </div>
            [/@compress]
        [/#if] 
    [/#list]
</div>
    
