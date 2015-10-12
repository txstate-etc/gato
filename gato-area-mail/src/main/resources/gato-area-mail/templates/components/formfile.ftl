[#assign title = gf.cleanFormElementTitle(content.title!"")]

<div class="formelement">
[#if (content.title!"")?has_content]
  <label for="${title}" class="txst-form-text-label">
    ${cmsfn.decode(content).title}
    [#if content.mandatory!false]*[/#if]
  </label>
[/#if]
[#if content.mandatory!false]
  <input type="hidden" name="mgnlMandatory" value="${title}" />
[/#if]

  <input type="file" id="${title}" name="${title}" size="50" />
[#assign exts = []]
[#list content.extension as extension]
  [#assign exts = exts + gf.getEquivalentExtensions(extension)]
[/#list]

  <script type="text/javascript">
    $('${title}').allowableFileExts = ['${exts?join("','")}'];
  </script>

  <span class='valid-icon-cont'>
    <span class="txst-form-validicon txst-form-file">&nbsp;</span>
  </span>
</div>
