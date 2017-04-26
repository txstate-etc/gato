<div class="contact">
    <p class="org-name">${content.organization_name}</p>
    <ul class="address horizontal-list">
        <li>${content.address_line_1}</li>
        [#if content.address_line_2?has_content]
            <li>${content.address_line_2}</li>
        [/#if]
        <li>
            ${content.city}, ${content.state} ${content.zip}
        </li>
    </ul>
    <ul class="phones horizontal-list">
        <li>
            <span class="label">Phone:</span> ${content.phone}
        </li>
        [#if content.fax?has_content]
            <li>
                <span class="label">Fax:</span> ${content.fax}
            </li>
        [/#if]
    </ul>
</div>