<div class="formelement conditional ${(cmsfn.isEditMode())?then("edit", "")}">
  [#assign title=ctx.formModel.getSafeTitle(cmsfn.asJCRNode(content).identifier)]
  [#if content.mandatory!false]
    <input type="hidden" name="mgnlMandatory" value="${title}" />
  [/#if]
  [#if content.type == "select"]
    [#if (content.title!"")?has_content || content.mandatory!false]
      <label for="${title}" class="txst-form-text-label">
        ${cmsfn.decode(content).title!}
        [#if content.mandatory!false]*[/#if]
      </label>
    [/#if]
    [#if content.helptext??]
      <div id="${title}-help" class="helptext">${content.helptext}</div>
    [/#if]
    [#assign answers = []]
    [#if content.answers??]
      [#assign answers = cmsfn.children(content.answers)]
    [/#if]
    <select class="txst-select conditional-select" name="${title}" id="${title}" [#if content.mandatory!false]aria-required="true"[/#if] [#if content.helptext??]aria-describedby="${title}-help"[/#if]>
      <option value="not selected">Select</option>
      [#list answers as answer]
        <option class="choice" value="${answer.title}" data-id=${answer.id}>${answer.title}</option>
      [/#list]
    </select>
  [#else]
    <fieldset class="selectiongroup">
      [#if (content.title!"")?has_content || content.mandatory!false]
        <legend for="${title}">
          <div class="txst-form-text-label">
            ${cmsfn.decode(content).title!}
            [#if content.mandatory!false]*[/#if]
          </div>
          [#if content.helptext??]
            <div id="${title}-help" class="helptext">${content.helptext}</div>
          [/#if]
        </legend>
      [/#if]
      <div class="txst-form-selectiongroup radio-type conditional" id="${title}">
        [#assign answers = []]
        [#if content.answers??]
          [#assign answers = cmsfn.children(content.answers)]
        [/#if]
          [#list answers as answer]
            <div class="txst-form-selection-item">
              <div class="field-cont">
                <input name="${title}" id="${title}${answer?index}" type="radio" class="radio choice" value="${answer.title}" data-id=${answer.id} [#if content.mandatory!false]aria-required="true"[/#if][#if answer.helptext?has_content]aria-describedby="${title}${answer?index}-help"[/#if]/>
                <label for="${title}${answer?index}" class="txst-form-selection-label">${answer.title}</label>
              </div>
              [#if answer.helptext?has_content]<div class="helptext radio" id="${title}${answer?index}-help">${answer.helptext}</div>[/#if]
            </div>
          [/#list]
      </div>
    </fieldset>
  [/#if]
  [@cms.area name="questions" contextAttributes={"formModel":ctx.formModel}/]
</div>
