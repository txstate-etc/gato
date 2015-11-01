[#include "/gato-template/templates/includes/head.ftl"]

[#attempt]
  [#assign navigationRootLevel=cmsfn.inherit(content).navigationRootLevel?number]
[#recover]
  [#assign navigationRootLevel=1]
[/#attempt]
[#assign sectionHomePage=(ancestorstopdown+[page])[navigationRootLevel-1]]
[#assign sectionIsHomePage=navigationRootLevel == 1]
