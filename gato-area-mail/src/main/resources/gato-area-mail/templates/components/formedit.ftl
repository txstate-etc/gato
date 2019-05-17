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
[#assign needCounter=(content.maxlength?? && content.maxlength > 0 && dataType == "none")]
[#if needCounter]
  <div class="charcounter">
    <span class="charsentered">0</span>/<span class="maxchars">${content.maxlength}</span>
  </div>
[/#if]
[#assign limited=needCounter?string('limited','')]

[#if content.lines?? && content.lines == "multi" && dataType == "none"]
  <textarea name="${title}" id="${title}" rows="7" cols="60" class="${limited}" [#if content.mandatory!false]aria-required="true"[/#if] aria-invalid="false" data-aria-describedby="${title}-error"></textarea>
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
  <input type="${inputType}" id="${title}" name="${title}" class="text ${limited}" size="${inputSize}" [#if content.mandatory!false]aria-required="true"[/#if] aria-invalid="false" data-aria-describedby="${title}-error"/>

  [#if (content.dataType!"") == "date"]
    <script type="text/javascript">
      $('${title}').valid_fromDate = '${content.datefrom!""}';
      $('${title}').valid_toDate = '${content.dateto!""}';
    </script>
  [/#if]

  [#if (content.dataType!"") == "regex"]
    [#assign regex = (content.regexregex!"")?replace("\\", "\\\\")]
    [#assign regex = regex?replace("'", "\\\'")]
    [#assign message = (content.regexerror!"")?replace("'", "\\\'")]
    <script type="text/javascript">
      $('${title}').valid_regex = '${regex}';
      $('${title}').valid_msg = '${message}';
    </script>
  [/#if]
[/#if]
[#if needCounter ]
  <script type="text/javascript">
    $('${title}').maxchars = parseInt(${(content.maxlength!0)?c}, 10);
 </script>
[/#if]
[#if validating]
  <span class="valid-icon-cont">
    <div class="txst-form-validicon txst-form-${dataType!}" id="${title}-error" role="alert" aria-hidden="true">&nbsp;</div>
  </span>
[/#if]

</div>
