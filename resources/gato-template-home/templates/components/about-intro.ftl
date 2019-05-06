[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]
<div class="gato-section-centered">
    <div class="mobilefirst-pattern centered">
        <div class="pattern-content arrow title-type about-intro">
            <div class="background-image" style='background-image: url("${gf.getImgDefault(content.backgroundimage)}")'>
                [#if content.image?has_content]
                <div class="corner-image">
                    <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!''}" class="${content.color}" position="absolute"/>
                </div>
                [/#if]
                <div class="content">
                    [#if content.subheading?has_content]
                        <div class="subheading centered">${content.subheading}</div>
                    [/#if]
                    [#include "/gato-component-patterns/templates/components/common/titlebuttons.ftl"]
                </div>
            </div>
        </div>
    </div>
</div>    