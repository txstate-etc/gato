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
    [#assign maxwidth = 1]
    [#list rows as row]
      [#assign width = row?replace('\\s+$','','r')?split("\t")?size]
      [#if width > maxwidth][#assign maxwidth = width][/#if]
    [/#list]
    [#assign startingRow = 0]
    <table cellspacing="0" class="gato-table ${cssClasses}">
      [#if content.tableCaption?has_content]
      <caption><p>${content.tableCaption}</p></caption>
      [/#if]
      [#if content.tableHeader && rows?size > 0]
        [#assign headers = rows?first?replace('\\s+$','','r')?split("\t")]
        [#assign headercolspan = 1]
        [#if headers?size < maxwidth]
          [#assign headercolspan = maxwidth - headers?size + 1]
        [/#if]
        [#assign startingRow = 1]
        <thead>
            <tr>
                [#list headers as col]
                    [#assign cs = ""]
                    [#if col?is_last && headercolspan > 1]
                      [#assign cs = "colspan='" + headercolspan + "'"]
                    [/#if]
                    <th ${cs}>${(col?has_content)?string(col, "&nbsp;")}</th>
                [/#list]
            </tr>
        </thead>
      [/#if]
      [#if rows?size > startingRow]
        <tbody>
          [#assign evenodd = 'even']
          [#assign tbodyhascontent = false]
          [#list rows as row]
            [#if row?trim?has_content && row_index gte startingRow]
              [#if row?replace('\\s+$','','r')?split("\t")?size == 1 && row?trim?starts_with("*")]
                [#if tbodyhascontent]</tbody><tbody>[/#if]
                <tr class="headerrow"><th colspan="${maxwidth}">${row?trim[1..]}</th></tr>
                [#assign tbodyhascontent = true]
              [#else]
                <tr class="${evenodd}">
                  [#list row?split("\t") as col]
                    [#if col?trim?has_content || col_index < maxwidth]
                      <td>
                        [#if (content.tableResponsive!false) && content.tableHeader && col_index < headers?size]
                          <div class="carded-label">${headers[col_index]}</div>
                        [/#if]
                        ${(col?trim?has_content)?string(col, "&nbsp;")}
                      </td>
                      [#assign tbodyhascontent = true]
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
