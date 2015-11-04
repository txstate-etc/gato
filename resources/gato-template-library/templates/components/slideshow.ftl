<div class="gato-slideshow" id="${gf.uniqueId(content)}">
    [@cms.area name="slides" /]
    <script type="text/javascript">
        new texas_slideshow($('${gf.uniqueId(content)}'), { timer : ${content.defaultTimer} });
    </script>
</div>


