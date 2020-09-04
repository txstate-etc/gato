[#assign title = ctx.request.getAttribute("safeTitle")]

<div class="formelement">
[#if (content.title!"")?has_content || content.mandatory!false]
  <label for="${title}" class="txst-form-text-label">
    ${cmsfn.decode(content).title!}
    [#if content.mandatory!false]*[/#if]
  </label>
[/#if]
[#if content.helptext?has_content]
  <div class="helptext" id="${title}-help">${content.helptext}</div>
[/#if]
[#if content.mandatory!false]
  <input type="hidden" name="mgnlMandatory" value="${title}" />
[/#if]

  <input type="file" id="${title}" name="${title}" size="50" [#if content.mandatory!false]aria-required="true"[/#if] aria-invalid="false" data-aria-describedby="${title}-error" [#if content.helptext?has_content]aria-describedby="${title}-help" data-help="${title}-help"[/#if]/>
[#assign exts = []]
[#if content.extension?has_content]
[#list content.extension as extension]
  [#assign exts = exts + gf.getEquivalentExtensions(extension)]
[/#list]

  <script type="text/javascript">
    $('${title}').allowableFileExts = ['${exts?join("','")}'];
  </script>
[#else]
  <script type="text/javascript">
    $('${title}').allowableFileExts = [];
  </script>
[/#if]

  <span class='valid-icon-cont'>
    <div class="txst-form-validicon txst-form-file" id="${title}-error" role="alert">&nbsp;</div>
  </span>
</div>
