[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html>
	<head>
		<link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-signs/css/signs.compiled.css"/>
    [#list ['gato-lib/js/prototype.js',
            'gato-lib/js/scriptaculous/scriptaculous.js',
            'gato-lib/js/scriptaculous/effects.js',
            'gato-lib/js/gato-lib.js',
            'gato-lib/js/modal.js',
            'gato-template-signs/js/slides.js'
            ] as script]
      <script type="text/javascript" src="${gf.resourcePath()}/${script}"></script>
    [/#list]
    [@meta publisher /]
    [@customCSS page ancestorstopdown /]
    <script type="text/javascript" src="${gf.replaceExtension(cmsfn.link(page), 'js')}"></script>
    [@title publisher /]
    [@favicons /]
    [@javascriptvariables /]
    [@cms.page /]
	</head>

	<body class="${ cmsfn.isEditMode()?string('admin', 'public') }">
		[#if cmsfn.isEditMode()]
			<div class="topcontent">
				<span class="adminheader">Top-Level Content</span>
			</div>
		[/#if]

		[#assign signstyles=gf.propertyValues(content.styles)]
		[#if signstyles?has_content]
  		[#assign stylestring=signstyles?join(',')]
  	[#else]
      [#assign stylestring='fade,slide']
    [/#if]
		[cms.area name="contentParagraph" contextAttributes={styles: stylestring}/]
		[@cssjsmodals /]
	</body>
</html>
