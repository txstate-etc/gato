[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]

<div class="mobilefirst-pattern">
    <div class="pattern-content arrow title-type about-intro">
        <div style='background-image: url("${gf.getImgDefault(content.backgroundimage)}")'>
            <div class="corner-image">
                <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!''}" class="${content.color}" position="absolute"/>
            </div>
            <div class="content">
                <div class="subheading centered">${content.subheading}</div>
                [#include "/gato-component-patterns/templates/components/common/titlebuttons.ftl"]
            </div>
        </div>
    </div>
</div>