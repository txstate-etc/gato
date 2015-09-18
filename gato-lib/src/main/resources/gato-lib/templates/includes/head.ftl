[#macro javascript scripts]
  <script type="text/javascript" src="${ctx.contextPath}/.resources/gato-lib/js/jquery.js"></script>
  <script type="text/javascript">jQuery.noConflict();</script>
  [#list ['gato-lib/js/prototype.js', 
          'gato-lib/js/scriptaculous/scriptaculous.js',
          'gato-lib/js/scriptaculous/effects.js',
          'gato-lib/js/gato-lib.js', 
          'gato-lib/js/modal.js', 
          'gato-lib/js/element-queries/ElementQueries.js',
          'gato-lib/js/element-queries/ResizeSensor.js'          
          ] + scripts as script]
    <script type="text/javascript" src="${ctx.contextPath}/.resources/${script}"></script>
  [/#list]
[/#macro]

[#macro css files]
  [#list ['gato-lib/css/grid.css', 'gato-component-faq/css/faqitem.css', 'gato-component-dept-directory/css/departmentDirectory.css'] + files as file]
    <link rel="stylesheet" type="text/css" href="${ctx.contextPath}/.resources/${file}"/>
  [/#list]
[/#macro]

[#macro inheritLoop page ancestors]
  [#list ancestors as anc]
    [#nested anc, true /]
  [/#list]
  [#nested page, false /]
[/#macro]
