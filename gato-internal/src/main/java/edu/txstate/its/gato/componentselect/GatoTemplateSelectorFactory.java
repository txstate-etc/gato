package edu.txstate.its.gato.componentselect;

import info.magnolia.cms.i18n.Messages;
import info.magnolia.cms.i18n.MessagesManager;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.objectfactory.Components;
import info.magnolia.rendering.template.TemplateDefinition;
import info.magnolia.rendering.template.assignment.TemplateDefinitionAssignment;
import info.magnolia.ui.form.field.definition.SelectFieldOptionDefinition;
import info.magnolia.ui.form.field.factory.SelectFieldFactory;
import info.magnolia.ui.vaadin.integration.jcr.JcrNewNodeAdapter;
import info.magnolia.ui.vaadin.integration.jcr.JcrNodeAdapter;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Comparator;

import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.RepositoryException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vaadin.data.Item;

//Identical to Magnolia's TemplateSelectorFieldDefinition except the templates are
//sorted based on their sortOrder parameter instead of alphabetically.
/**
 * Define a Template selector field.
 * The values displayed in the field are initialized based on the
 * related Item (Image of a JCR node) and {@link TemplateDefinitionAssignment}.
 */
public class GatoTemplateSelectorFactory extends SelectFieldFactory<GatoTemplateSelectorDefinition> {

    private static final Logger log = LoggerFactory.getLogger(GatoTemplateSelectorFactory.class);
    private TemplateDefinitionAssignment templateAssignment;

    /**
     * @deprecated since 5.3.4 use the other constructor instead.
     */
    @Deprecated
    public GatoTemplateSelectorFactory(GatoTemplateSelectorDefinition definition, Item relatedFieldItem) {
        this(definition, relatedFieldItem, Components.getComponent(TemplateDefinitionAssignment.class));
    }

    @Inject
    public GatoTemplateSelectorFactory(GatoTemplateSelectorDefinition definition, Item relatedFieldItem, TemplateDefinitionAssignment templateDefinitionAssignment) {
        super(definition, relatedFieldItem);
        this.templateAssignment = templateDefinitionAssignment;
    }

    /**
     * Returns the available templates based on the current node.
     */
    @Override
    public List<SelectFieldOptionDefinition> getSelectFieldOptionDefinition() {
        List<SelectFieldOptionDefinition> res = new ArrayList<SelectFieldOptionDefinition>();

        if (item instanceof JcrNodeAdapter) {
            
            Node associatedNode = ((JcrNodeAdapter) item).getJcrItem();
           
            Collection<TemplateDefinition> templates = Collections.emptySet();

            if (item instanceof JcrNewNodeAdapter) {
                // creates a temporary node underneath the parent to overcome a restriction in template availability,
                // see MGNLSTK-1185
                try {
                    Node tempNode = associatedNode.addNode("temp", NodeTypes.Page.NAME);
                    templates = templateAssignment.getAvailableTemplates(tempNode);
                    associatedNode.getSession().removeItem(tempNode.getPath());
                } catch (RepositoryException e) {
                    log.error("Could not create temporary node to get available templates.", e);
                }
            }

            else {
                templates = templateAssignment.getAvailableTemplates(associatedNode);
            }

            //sort the templates by their sort order specified in the template
            Comparator<TemplateDefinition> comparator = new Comparator<TemplateDefinition>(){
                public int compare(TemplateDefinition template1, TemplateDefinition template2){
                    int template1SortOrder=1000, template2SortOrder=1000;
                    if(template1.getParameters().get("sortOrder")!= null){
                        template1SortOrder = (int) template1.getParameters().get("sortOrder");
                    }
                    if(template2.getParameters().get("sortOrder")!= null){
                        template2SortOrder = (int) template2.getParameters().get("sortOrder");
                    }
                    return template1SortOrder - template2SortOrder;
                }
            };
            List<TemplateDefinition> templateList = new ArrayList<TemplateDefinition>(templates);
            Collections.sort(templateList,comparator);


            for (TemplateDefinition templateDefinition : templateList) {
                SelectFieldOptionDefinition option = new SelectFieldOptionDefinition();
                option.setValue(templateDefinition.getId());
                String label = getI18nTitle(templateDefinition);
                option.setLabel(label);
                res.add(option);
            }
        }

        return res;
    }

    @Override
    protected Class<?> getDefaultFieldType() {
        return String.class;
    }


    /**
     * Get i18n Template title.
     */
    // FIXME: SCRUM-1635 (ehe) review PageEditorPresenter and way Templates are parsed.
    public static synchronized String getI18nTitle(TemplateDefinition templateDefinition) {
        Messages messages = MessagesManager.getMessages(templateDefinition.getI18nBasename());
        return messages.getWithDefault(templateDefinition.getTitle(), templateDefinition.getTitle());
    }
}