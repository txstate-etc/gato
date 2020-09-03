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
    [#assign answers = []]
    [#if content.answers??]
      [#assign answers = cmsfn.children(content.answers)]
    [/#if]
    <select class="txst-select conditional-select" name="${title}" id="${title}" [#if content.mandatory!false]aria-required="true"[/#if]>
      <option value="not selected">Select</option>
      [#list answers as answer]
        <option class="choice" value="${answer.title}" data-id=${answer.id}>${answer.title}</option>
      [/#list]
    </select>
  [#else]
    <fieldset class="selectiongroup">
      [#if (content.title!"")?has_content || content.mandatory!false]
        <legend for="${title}" class="txst-form-text-label">
          ${cmsfn.decode(content).title!}
          [#if content.mandatory!false]*[/#if]
        </legend>
      [/#if]
      <div class="txst-form-selectiongroup radio-type conditional" id="${title}">
        [#assign answers = []]
        [#if content.answers??]
          [#assign answers = cmsfn.children(content.answers)]
        [/#if]
        <div>
          [#list answers as answer]
            <div class="txst-form-selection-item">
              <input type="radio" class="radio choice" name=${title} id=${title}${answer?index} value="${answer.title}" data-id=${answer.id} />
              <label for="${title}${answer?index}" class="txst-form-selection-label">${answer.title}</label>
            </div>
          [/#list]
        </div>
      </div>
    </fieldset>
  [/#if]
  [@cms.area name="questions" contextAttributes={"formModel":ctx.formModel}/]
</div>
