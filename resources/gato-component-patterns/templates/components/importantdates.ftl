[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]
<div class="mobilefirst-pattern">
  <div class="pattern-content single arrow title-type text-center importantdates">
    <div class="centered flex">
      <h2 class="title">${content.title}</h2>
      [#if content.events?has_content]
        [#list cmsfn.children(content.events) as lnk]
          <div>
            <!--Get day of the month-->
            <div class="text">
              <h3>${lnk.date?string["dd"]}</h3>
              <h4>${lnk.date?string["MMM"]}</h4>
            </div>
            <div class="links">
              <ul>
                <li><a href="${gf.filterUrl(lnk.link)}">${lnk.title!}</a></li>
              </ul>
            </div>
          </div>
        [/#list]
      [/#if]
      </div>
    </div>
</div>