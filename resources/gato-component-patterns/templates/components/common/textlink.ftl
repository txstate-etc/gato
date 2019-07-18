[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]
<div class="pattern-content text-link ${content.color!}">
  [#assign headerLevel = 2]
  [#if !gf.isEmptyString(content.title)]
    <h2 class="title">${content.title}</h2>
    [#assign headerLevel = 3]
  [/#if]
  [#if content.text?has_content]<div class="text">${gf.processRichTextLevel(cmsfn.decode(content).text, headerLevel)}</div>[/#if]
  [#if content.links?has_content]
    <div class="links">
      <ul>
      [#list cmsfn.children(content.links) as lnk]
        <li>
          <a href="${gf.filterUrl(lnk.link)}">${lnk.text!}</a>
        </li>
      [/#list]
      </ul>
    </div>
  [/#if]
</div>