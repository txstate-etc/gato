<div class="social-media-icons">
    <ul id="social-media-container">
        [#list components as component]
        <li class="social-media-link">
            [@cms.component content=component /]
        </li>
        [/#list]
    </ul>
</div>