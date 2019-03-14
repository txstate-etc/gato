package edu.txstate.its.gato;

import info.magnolia.ui.vaadin.gwt.client.shared.AreaElement;
import info.magnolia.rendering.template.TemplateDefinition;
import info.magnolia.rendering.template.registry.TemplateDefinitionRegistry;
import info.magnolia.ui.vaadin.gwt.client.shared.ComponentElement;
import info.magnolia.config.registry.DefinitionProvider;
import info.magnolia.jcr.util.NodeTypes.Renderable;
import info.magnolia.rendering.template.AreaDefinition;
import info.magnolia.context.MgnlContext;
import info.magnolia.rendering.template.ComponentAvailability;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Node;

class ElementUtil {
    private static final Logger log = LoggerFactory.getLogger(RepositoryException.class);

    public static AreaElement getParent(ComponentElement element, TemplateDefinitionRegistry templateDefinitionRegistry) {
        AreaElement parent = new AreaElement();
        TemplateDefinition templateDefinition = null;
        AreaDefinition areaDef = null;
        int i = 1;
        String availableComponents = "";

        try {
            Session session = MgnlContext.getJCRSession(element.getWorkspace());
            Node parentNode = session.getNode(element.getPath()).getParent();
  
            while (!parentNode.hasProperty("mgnl:template")) {
              parentNode = parentNode.getParent();
            }
            String templateId = Renderable.getTemplate(parentNode);
  
            DefinitionProvider<TemplateDefinition> templateProvider = templateDefinitionRegistry.getProvider(templateId);
            if (templateProvider.isValid()) {
              templateDefinition = templateProvider.get();
              
              for (String key : templateDefinition.getAreas().keySet()){
                areaDef = templateDefinition.getAreas().get(key);
              }
              
              for (ComponentAvailability component : areaDef.getAvailableComponents().values()) {
                availableComponents = availableComponents + component.getId();
                if (i < areaDef.getAvailableComponents().values().size()) {
                  availableComponents = availableComponents + ",";
                }
                i++;
              }
            }
            
            parent = new AreaElement(element.getWorkspace(), parentNode.getPath(), null, availableComponents);
            parent.setAddible(isAddible(areaDef, parentNode));
          }
          catch (RepositoryException e) {
            log.debug("Error:", e);       
          }        

        return parent;
    }

    //recreating logic found in MgnlArea.getTypedElement(), which is where addible is usually set.
    public static Boolean isAddible(AreaDefinition areaDef, Node parentNode) {
      boolean addible = true;

      try {
        boolean hasAvaialbleComponents = areaDef.getAvailableComponents().size() > 0;
        boolean isTypeSingle = "single".equals(areaDef.getType());
        boolean areaHasChildComponents = parentNode.getNodes().getSize() > 0;
        boolean isMaxComponentsReached = (areaDef.getMaxComponents() == null || parentNode.getNodes().getSize() < areaDef.getMaxComponents() );
        addible = (addible && hasAvaialbleComponents  && !(isTypeSingle && areaHasChildComponents && !isMaxComponentsReached));
      }
      catch (RepositoryException e) {
        log.debug("Error:", e);
      }
      return addible;        

    }
}