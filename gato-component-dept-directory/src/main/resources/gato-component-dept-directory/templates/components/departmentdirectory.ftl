[#macro directoryEntry person]
    [#if !(person?is_string)]
        <div class="dd-entry vcard">
            <div class="dd-name fn n">
                <span class="given-name">${person.firstname}</span>
                <span class="family-name">${person.lastname}</span>
                -
                ${person.category}
                &nbsp;
            </div>
            <div class="dd-title">
                ${person.title}
                &nbsp;
            </div><div class="dd-address street-address">
                ${person.address}
                &nbsp;
            </div>
             <div class="dd-phone tel">
             <span class="dd-icon"><i class="fa fa-phone"></i></span>
                ${person.phone}
                &nbsp;
            </div><div class="dd-email email">
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
<div class="gato-departmentdirectory">
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
            <div class="dd-row">
                [@directoryEntry person /]
            </div>
            [/@compress]
        [/#if]
    [/#list]
</div>
