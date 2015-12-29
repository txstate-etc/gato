[#macro javascript scripts=[]]
  <script type="text/javascript" src="${gf.resourcePath()}/gato-lib/js/jquery.js"></script>
  <script type="text/javascript">jQuery.noConflict();</script>
  [#list ['gato-lib/js/prototype.js',
          'gato-lib/js/scriptaculous/scriptaculous.js',
          'gato-lib/js/scriptaculous/effects.js',
          'gato-lib/js/velocity.js',
          'gato-lib/js/elementqueries.js',
          'gato-lib/js/gato-lib.js',
          'gato-lib/js/modal.js'
          ] + scripts as script]
    <script type="text/javascript" src="${gf.resourcePath()}/${script}"></script>
  [/#list]
[/#macro]

[#macro css files]
  [#list ['gato-lib/css/grid.css', 'gato-component-dept-directory/css/departmentDirectory.css'] + files as file]
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/${file}"/>
  [/#list]
[/#macro]

[#macro javascriptvariables]
  <script type="text/javascript">
    var serverDateTime = new Date(${.now?long});
    var magnolia_assets_url = "${gf.resourcePath()}";
    var isEditMode = ${cmsfn.isEditMode()?string};
    [#nested]
  </script>
[/#macro]

[#macro inheritLoop page ancestors]
  [#list ancestors as anc]
    [#nested anc, true /]
  [/#list]
  [#nested page, false /]
[/#macro]

[#function isEnabled component]
  [#if !(component.enabled!false)][#return false /][/#if]
  [#if component.displaystart?has_content && component.displaystart > .now][#return false /][/#if]
  [#if component.displayend?has_content && component.displayend < .now][#return false /][/#if]
  [#return true /]
[/#function]
