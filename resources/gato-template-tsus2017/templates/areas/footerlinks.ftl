[#include "/gato-lib/templates/includes/areamacros.ftl"]
[#assign count = components?size]
[#assign linksPerColumn = (count == 0)?string(1,(count/3)?ceiling)]
[#list components?chunk(linksPerColumn?number) as row]
    <div class="col">
        <ul>
        [#list row as link]
            <li>[@cms.component content=link /]</li>
        [/#list]
        </ul>
    </div>
[/#list]
[@ifneedsnewbar components def]
    <li class="listItems_add" cms:add="bar"></li>
[/@ifneedsnewbar]