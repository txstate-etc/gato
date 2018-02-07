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
      [#if content.tableCaption?has_content]
      <caption><p>${content.tableCaption}</p></caption>
      [/#if]
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
          [#assign evenodd = 'even']
          [#list rows as row]
            [#if row?trim?has_content && row_index gte startingRow]
              [#assign cells = row?replace('\\s+$','','r')?split("\t")]
              [#assign headerrow = cells?size == 1]
              [#if cells?size == 1]
                </tbody><tbody>
                <tr class="headerrow"><th colspan="${headers?size}">${cells[0]}</th></tr>
              [#else]
                <tr class="${evenodd}">
                  [#list cells as col]
                    [#if col?trim?has_content || col_index < headers?size]
                      <td>
                        [#if (content.tableResponsive!false) && content.tableHeader && col_index < headers?size]
                          <div class="carded-label">${headers[col_index]}</div>
                        [/#if]
                        ${(col?trim?has_content)?string(col, "&nbsp;")}
                      </td>
                    [/#if]
                  [/#list]
                </tr>
                [#assign evenodd = (evenodd=='even')?string('odd','even')]
              [/#if]
            [/#if]
          [/#list]
        </tbody>
      [/#if]
    </table>
  </div>
[/#if]
