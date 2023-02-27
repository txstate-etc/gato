[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#if !gf.isEmptyString(content.title)]
    [@h2]${content.title}[/@h2]
[/#if]
<ul class="gato-styled-list ${cmsfn.isEditMode()?then("edit", "")}">
[@cms.area name="list" contextAttributes={"alphabetize": content.alphabetize!false  }/]
</ul>
