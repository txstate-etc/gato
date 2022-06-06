[#include "/gato-component-patterns/templates/includes/pattern.ftl"]
[@prebuiltsection]
  [#if cmsfn.isEditMode()]
    <div class="content-edit" cms:edit="bar"></div>
  [/#if]
  <div class="mobilefirst-pattern">
    <div class="pattern-content single">
      <div class="centered">
        <div class="infocallout">
          <div class="infocallout-content">
            <i class="fas fa-info-circle" aria-hidden="true"></i>
            <div>
              <h2 class="infocallout-title">${content.title!}</h2>
              <div class="infocallout-text">${gf.processRichText(cmsfn.decode(content).text)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
[/@prebuiltsection]