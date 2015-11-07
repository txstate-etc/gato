<!DOCTYPE HTML>
<html>
<head>
  <title>Gato Site Index</title>
  [@cms.init/]
</head>
<body style="background-color: white">
  <h1>Gato Site Index</h1>
  <ul style="list-style: none; padding: 0">
  [#list cmsfn.children(cmsfn.root(content), 'mgnl:page') as sitehome]
    [#if cmsfn.metaData(sitehome, 'template') != 'gato-template:pages/siteindex']
      [#assign bgcolor = (sitehome_index % 2 == 0)?string('#EFEFEF', '#DDDDDD')]
      <li style="background-color: ${bgcolor}; padding: 4px"><a href="${cmsfn.link(sitehome)}" style="display: inline-block; width: 300px">${sitehome.@name}</a> ${gf.nodeTitle(sitehome)}</li>
    [/#if]
  [/#list]
  </ul>
</body>
</html>
