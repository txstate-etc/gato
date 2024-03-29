[#assign title = ctx.request.getAttribute("safeTitle")]

[#assign formHasSenderEmail = ctx.request.getAttribute("formHasSenderEmail")!false]
[#assign formHasSenderName = ctx.request.getAttribute("formHasSenderName")!false]
[#assign inputType = "text"]
[#assign dataType = content.dataType!"none"]

[#-- The dataType for both email fields is 'email' now but we need it to be 'txemail'
for Texas State email addresses for the validation--]
[#if dataType == "email" && (content.emailType!"") == "txstate"]
  [#assign dataType = "txemail"]
[/#if]

[#if content.isSenderEmail!false && dataType == "email"]
  [#if !formHasSenderEmail]
    [#assign title = "SenderEmail"]
    [#assign inputType = "email"]
    ${ctx.request.setAttribute("formHasSenderEmail", true)}
  [/#if]
[/#if]

[#if content.isSenderName!false && dataType == "name"]
  [#if !formHasSenderName]
    [#assign title = "SenderName"]
    ${ctx.request.setAttribute("formHasSenderName", true)}
  [/#if]
[/#if]

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
[#if content.helptext??]
  <div class="helptext" id="${title}-help">${content.helptext}</div>
[/#if]
[#assign needCounter=(content.maxlength?? && content.maxlength > 0 && (dataType == "none" || dataType == "integer" || dataType == "keystring"))]
[#if needCounter]
  <div class="charcounter">
    <span class="charsentered">0</span>/<span class="maxchars">${content.maxlength}</span>
  </div>
[/#if]
[#assign limited=needCounter?string('limited','')]

[#if content.lines?? && content.lines == "multi" && dataType == "none"]
  <textarea name="${title}"
            id="${title}"
            rows="7"
            cols="60"
            class="${limited}"
            [#if needCounter!false]data-maxchars="${(content.maxlength!0)?c}"[/#if]
            [#if content.mandatory!false]aria-required="true"[/#if]
            aria-invalid="false" data-aria-describedby="${title}-error"
            [#if content.helptext??]data-help="${title}-help" aria-describedby="${title}-help"[/#if]></textarea>
  [#assign validating=needCounter]
[#else]
  [#assign inputSize = "60"]
  [#assign validating = true]
  [#switch dataType]
    [#case "netid"]
    [#case "zip"]
      [#assign inputSize = "8"]
      [#break]
    [#case "anumber"]
      [#assign inputSize = "10"]
      [#break]
    [#case "date"]
      [#assign inputType = "date"]
      [#break]
    [#case "integer"]
      [#assign validating = needCounter]
    [#case "decimal"]
      [#assign inputSize = "12"]
      [#break]
    [#case "phone"]
      [#assign inputSize = "15"]
      [#break]
    [#case "keystring"]
      [#assign inputSize = "20"]
      [#break]
    [#case "regex"]
    [#case "email"]
    [#case "txemail"]
      [#assign inputSize = "50"]
      [#break]
    [#case "none"]
      [#-- the only validating done on a 'none' field is limiting the length --]
      [#assign validating = needCounter]
      [#break]
    [#default]
      [#assign validating = false]
  [/#switch]
  [#if (content.dataType!"") == "regex"]
    [#assign regex = (content.regexregex!"")]
    [#assign message = (content.regexerror!"")?replace("'", "\\\'")]
  [/#if]
  <input type="${inputType}"
         id="${title}"
         name="${title}"
         class="text ${limited}"
         size="${inputSize}"
         [#if needCounter!false]data-maxchars="${(content.maxlength!0)?c}"[/#if]
         [#if content.mandatory!false]aria-required="true"[/#if]
         aria-invalid="false"
         data-aria-describedby="${title}-error"
         [#if content.helptext??]data-help="${title}-help" aria-describedby="${title}-help"[/#if]
         [#if (content.dataType!"") == "date"] data-valid_fromdate='${content.datefrom!""}' data-valid_todate='${content.dateto!""}'[/#if]
         [#if (content.dataType!"") == "regex"] data-valid_regex='${regex}' data-valid_msg='${message}'[/#if]/>
[/#if]
[#if validating]
  <div class="valid-icon-cont">
    <div class="txst-form-validicon txst-form-${dataType!} ${needCounter?then('limited', '')}" id="${title}-error" role="alert" aria-hidden="true">&nbsp;</div>
  </div>
[/#if]

</div>
