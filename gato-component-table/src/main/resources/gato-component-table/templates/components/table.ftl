[#assign cssClasses = content.tableAltBg?string("table-alt", "")]
[#assign cssClasses = cssClasses + content.tableLinesHorizontal?string(" table-linesh", "")]
[#assign cssClasses = cssClasses + content.tableLinesVertical?string(" table-linesv", "")]
[#assign cssClasses = cssClasses + content.tableFontSmall?string(" table-fontsm", "")]
[#assign cssClasses = cssClasses + content.tableAlignment?string(" table-align-right", "")]
[#assign cssClasses = cssClasses + content.tableSortable?string(" sortable", "")]
[#assign cssClasses = cssClasses + (content.tableResponsive!false)?string(" carded", "")]

[#assign hScroll = (content.tableResponsive!false)?string("", "tableScroll")]

<div class="table-wrapper ${hScroll}">
    ${model.parseTableData(cssClasses)}
</div>
