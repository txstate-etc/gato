<div class="social-media-icons">
    <ul id="social-media-container">
        [#list components as component]
        <li class="social-media-link">
            [@cms.component content=component /]
        </li>
        [/#list]
        [#if cmsfn.isEditMode()]
            <div class="librarySocial_add" cms:add="box"></div>
        [/#if]
    </ul>
</div>