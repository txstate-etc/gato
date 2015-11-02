<div class="slides">
    [#list components as slide]
        [@cms.component content=slide contextAttributes={"index": slide_index} /]
    [/#list]
</div>

<ul class="pages">
    <li class="prev"><a href="#">&nbsp;</a></li>
    [#list components as slide]
        [#assign slideactive=(slide_index == 0)?string("active", "")]
        <li class="${slideactive}"><a href="#" id="page${slide_index}" title="${slide.title}">${slide_index+1}</a></li>
    [/#list]
    <li class="next"><a href="#">&nbsp;</a></li>
</ul>
