[#assign inheritedContent=cmsfn.inherit(content)]

<style type="text/css">
  body {
    background-color: ${ inheritedContent['background-color']!'white' };
  }

  div#outercontainer {
    background-color: ${ inheritedContent['background-color']!'white' };
    background-image: url(${gf.resourcePath()}/gato-template-wittliff/images/${ inheritedContent['background-image']!'bg-homepage.jpg' });
  }

  input.gato-search-query, #mainnav .submenu.active ul, #mainnav .submenu.active {
    background-color: ${ inheritedContent['background-color']!'white' };
  }

  .txst-photogallery-image {
    border-color: ${ inheritedContent['background-color']!'white' };
  }

  [#if inheritedContent['sectionhead-color']?has_content]
    h1 { color: ${inheritedContent['sectionhead-color']}; }
    hr {
      background-image: url(${gf.resourcePath()}/gato-template-wittliff/images/bg-section-sectionhead${ inheritedContent['sectionhead-color']?replace('#','') }.png);
    }
  [/#if]

  [#if inheritedContent['mainnav-color']?has_content]
    #mainnav a { color: ${ inheritedContent['mainnav-color'] }; }
  [/#if]

  [#if inheritedContent['mainnav-hover-color']?has_content]
    #mainnav a:hover { color: ${ inheritedContent['mainnav-hover-color'] }; }
  [/#if]
</style>
<script type="text/javascript">var wittliffPageBackgroundColor = "${ (inheritedContent['background-color']!'white')?replace('#','') }";</script>
