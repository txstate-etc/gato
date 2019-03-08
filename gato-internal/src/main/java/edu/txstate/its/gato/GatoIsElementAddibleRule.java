package edu.txstate.its.gato;

import info.magnolia.pages.app.editor.PageEditorPresenter;
import info.magnolia.ui.vaadin.gwt.client.shared.AbstractElement;
import info.magnolia.ui.vaadin.gwt.client.shared.AreaElement;
import info.magnolia.pages.app.editor.availability.AbstractElementAvailabilityRule;
import info.magnolia.rendering.template.registry.TemplateDefinitionRegistry;
import info.magnolia.ui.vaadin.gwt.client.shared.ComponentElement;


import javax.inject.Inject;

/**
 * This rule returns true if the {@link PageEditorPresenter#selectedElement} in the page editor is an area
 * and the user has the permission to add components based the 'addible' property.
 */
public class GatoIsElementAddibleRule extends AbstractElementAvailabilityRule<AbstractElement> {

    private final TemplateDefinitionRegistry templateDefinitionRegistry;

    @Inject
    public GatoIsElementAddibleRule(PageEditorPresenter pageEditorPresenter, TemplateDefinitionRegistry templateDefinitionRegistry) {
        super(pageEditorPresenter, AbstractElement.class);
        this.templateDefinitionRegistry = templateDefinitionRegistry;
    }

    @Override
    protected boolean isAvailableForElement(AbstractElement element) {
        
        if (element instanceof ComponentElement){
            ComponentElement component = (ComponentElement)element;
            element = ElementUtil.getParent(component, templateDefinitionRegistry);
        }
        
        AreaElement areaElement = (AreaElement)element;
        return areaElement.getAddible();

    }
}