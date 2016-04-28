[#assign title = ctx.request.getAttribute("safeTitle")]

<div class="formelement">
[#if (content.title!"")?has_content || content.mandatory!false]
  <label for="${title}" class="txst-form-text-label">
    ${cmsfn.decode(content).title!}
    [#if content.mandatory!false]*[/#if]
  </label>
[/#if]
[#if content.mandatory!false]
  <input type="hidden" name="mgnlMandatory" value="${title}" />
[/#if]

[#if content.type == "select"]
  <select name="${title}" id="${title}" [#if content.mandatory!false]aria-required="true"[/#if]>
  <option value="not selected">Please select:</option>
  [#list gf.orderedPropertyValues(content.options) as option]
    [#assign value = option?keep_before("|")]
    [#assign label = option?keep_after("|")]
    [#if !label?has_content][#assign label = value][/#if]
    <option value="${value}">${label}</option>
  [/#list]
  </select>
[#else]
  <div class="txst-form-selectiongroup" id="${title}">
  <input name="${title}" id="${title}-dummy-item" type="${content.type}" style="display:none" aria-hidden="true" value="" checked="checked" />
  [#assign i = 0]
  [#list gf.orderedPropertyValues(content.options) as option]
    <div class="txst-form-selection-item">
      [#assign value = option?keep_before("|")]
      [#assign label = option?keep_after("|")]
      [#if !label?has_content][#assign label = value][/#if]
      <input name="${title}" id="${title}${i}" type="${content.type}" class="${content.type}" value="${value}" [#if content.mandatory!false]aria-required="true"[/#if]/>
      <label for="${title}${i}" class="txst-form-selection-label">${label}</label>
    </div>
    [#assign i = i + 1]
  [/#list]
  </div>
[/#if]
</div>
