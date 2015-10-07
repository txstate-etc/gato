[#assign cssClasses = content.tableAltBg?string("table-alt", "")]
[#assign cssClasses = cssClasses + content.tableLinesHorizontal?string(" table-linesh", "")]
[#assign cssClasses = cssClasses + content.tableLinesVertical?string(" table-linesv", "")]
[#assign cssClasses = cssClasses + content.tableFontSmall?string(" table-fontsm", "")]
[#assign cssClasses = cssClasses + content.tableAlignment?string(" table-align-right", "")]
[#assign cssClasses = cssClasses + content.tableSortable?string(" sortable", "")]
[#assign cssClasses = cssClasses + content.tableResponsive?string(" carded", "")]

[#assign hScroll = content.tableResponsive?string("", "tableScroll")]

<div class="eq-parent ${hScroll}">
    ${model.parseTableData(cssClasses)}
</div>
