[#include "/gato-template/templates/includes/component.ftl"]

[@templatecomponent]

    ${ cmsfn.decode(content).text?replace("\n", "<br/>")}
    
[/@templatecomponent]
