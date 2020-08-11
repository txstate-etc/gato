<div class="formelement conditional two ${(cmsfn.isEditMode())?then("edit", "")}">
  [#assign questions = []]
  [#if content.questionlist??]
    [#assign questions = cmsfn.children(content.questionlist)]
  [/#if]
  [#list questions as question]
    <fieldset class="selectiongroup">
      [#assign title=ctx.formModel.getSafeTitle(cmsfn.asJCRNode(question).identifier)]
      <legend for="${title}" class="txst-form-text-label">
        ${question.title}
        [#if content.mandatory!false]*[/#if]
      </legend>
      <div class="txst-form-selectiongroup conditional" id="${title}">
        [#assign answers = []]
        [#if question.answerlist??]
          [#assign answers = cmsfn.children(question.answerlist)]
        [/#if]
        <div>
        [#list answers as answer]
          <div>
            <input type="radio" class="radio choicetwo" name=${title} id=${title}${answer?index} value=${answer.title} data-id=${answer.id} />
            <label for="${title}${answer?index}" class="txst-form-selection-label">${answer.title}</label>
          </div>
        [/#list]
        </div>
      </div>
    </fieldset>
  [/#list]
  [@cms.area name="questions" contextAttributes={"formModel":ctx.formModel}/]
</div>
