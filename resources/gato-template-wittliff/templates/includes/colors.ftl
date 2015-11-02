[#assign inheritedContent=cmsfn.inherit(content)]

<style type="text/css">
  body {
    background-color: ${ inheritedContent['background-color'] };
  }

  div#outercontainer {
    background-color: ${ inheritedContent['background-color'] };
    background-image: url(${gf.resourcePath()}/gato-template-wittliff/images/${ inheritedContent['background-image'] });
  }

  input.research {
    background-color: ${ inheritedContent['background-color'] };
  }

  .txst-photogallery-image {
    border-color: ${ inheritedContent['background-color'] };
  }

  [#if inheritedContent['sectionhead-color']?has_content]
    h1 { color: ${inheritedContent['sectionhead-color']}; }
  [/#if]
  hr {
    background-image: url(${gf.resourcePath()}/gato-template-wittliff/images/bg-section-sectionhead${ inheritedContent['sectionhead-color']?replace('#','') }.png);
  }

  [#if inheritedContent['mainnav-color']?has_content]
    #mainnav a { color: ${ inheritedContent['mainnav-color'] }; }
  [/#if]

  [#if inheritedContent['mainnav-hover-color']?has_content]
    #mainnav a:hover { color: ${ inheritedContent['mainnav-hover-color'] }; }
  [/#if]
</style>
<script type="text/javascript">var wittliffPageBackgroundColor = "${ inheritedContent['background-color']?replace('#','') }";</script>
