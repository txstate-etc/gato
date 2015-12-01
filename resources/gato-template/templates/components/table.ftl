[#assign cssClasses = content.tableAltBg?string("table-alt", "")]
[#assign cssClasses = cssClasses + content.tableLinesHorizontal?string(" table-linesh", "")]
[#assign cssClasses = cssClasses + content.tableLinesVertical?string(" table-linesv", "")]
[#assign cssClasses = cssClasses + content.tableFontSmall?string(" table-fontsm", "")]
[#assign cssClasses = cssClasses + content.tableAlignment?string(" table-align-right", "")]
[#assign cssClasses = cssClasses + content.tableSortable?string(" sortable", "")]
[#assign cssClasses = cssClasses + (content.tableResponsive!false)?string(" carded", "")]

[#assign hScroll = (content.tableResponsive!false)?string("", "tableScroll")]
[#assign decodedContent = cmsfn.decode(content)]

[#if decodedContent.tableData??]
    <div class="table-wrapper ${hScroll}">
        [#assign rows = decodedContent.tableData?split("\n")]
        [#assign startingRow = 0]
        <table cellspacing="0" class="gato-table ${cssClasses}">
            [#if content.tableHeader && rows?size > 0]
                [#assign headers = rows?first?split("\t")]
                [#assign startingRow = 1]
                <thead>
                    <tr>
                        [#list headers as col]
                            <th>${(col?has_content)?string(col, "&nbsp;")}</th>
                        [/#list]
                    </tr>
                </thead>
            [/#if]
            [#if rows?size > startingRow]
                <tbody>
                    [#list rows as row]
                      [#if row?trim?has_content && row_index gte startingRow]
                        <tr class="${(row_index % 2 == 0)?string("even", "odd")}">
                            [#list row?split("\t") as col]
                            [#if content.tableHeader]
                            <td data-label="${headers[col_index]}">
                            [#else]
                            <td>
                            [/#if]
                                ${(col?has_content)?string(col, "&nbsp;")}
                            </td>
                        [/#list]
                        </tr>
                      [/#if]
                    [/#list]
                </tbody>
            [/#if]
        </table>
    </div>
[/#if]
