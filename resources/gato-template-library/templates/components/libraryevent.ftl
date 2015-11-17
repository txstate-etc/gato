[#assign formattedStartDate = content.startDate?string["EEE, MMMM d"] ]
[#assign formattedEndDate = content.endDate?string["EEE, MMMM d"] ]

[#if content.image?has_content]
    <a href="${gf.filterUrl(content.link!)}" class="txst-eventsbox-image">
        <img src="${gf.getImgDefault(content.image)}" alt="${content.title}" />
    </a>
[/#if]
<a href="${gf.filterUrl(content.link!)}" class="txst-eventsbox-headline url">
    [#if formattedStartDate == formattedEndDate]
        <abbr class="dtstart" title="${ formattedStartDate}">${ formattedStartDate}</abbr>
    [#else]
        <abbr class="dtstart" title="${formattedStartDate}">${formattedStartDate}</abbr> -
        <abbr class="dtend" title="${ formattedEndDate}">${ formattedEndDate}</abbr>
    [/#if]
    <br />
    <span class="summary">${content.title!}</span>
</a>
<div class="txst-eventsbox-tease description">${content.text!}</div>