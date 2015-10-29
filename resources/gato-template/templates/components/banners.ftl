[#macro printimages banner]
  [#list banner.images as img]
    { src: "${gf.getImgDefault(img)}", srcset: "${gf.getSrcSet(img)}" }
  [/#list]
[/#macro]

<script type="text/javascript">
  var banners = [
    [#if content.reset != 'true']
      [#list ancestorsbottomup! as ancestor]
        [#assign banner = gf.singleComponent(ancestor, 'banners')!]
        [@printimages banner /]
        [#if banner.reset == 'true'][#break][/#if]
      [/#list]
    [/#if]
    [@printimages content /]
  ];
</script>
<div class="gato-banner-image">
  <img src="${gf.getImgDefault(content.images[0])}">
</div>
