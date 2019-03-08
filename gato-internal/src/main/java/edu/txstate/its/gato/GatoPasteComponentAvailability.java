/**
 * This file Copyright (c) 2016-2018 Magnolia International
 * Ltd.  (http://www.magnolia-cms.com). All rights reserved.
 *
 *
 * This file is dual-licensed under both the Magnolia
 * Network Agreement and the GNU General Public License.
 * You may elect to use one or the other of these licenses.
 *
 * This file is distributed in the hope that it will be
 * useful, but AS-IS and WITHOUT ANY WARRANTY; without even the
 * implied warranty of MERCHANTABILITY or FITNESS FOR A
 * PARTICULAR PURPOSE, TITLE, or NONINFRINGEMENT.
 * Redistribution, except as permitted by whichever of the GPL
 * or MNA you select, is prohibited.
 *
 * 1. For the GPL license (GPL), you can redistribute and/or
 * modify this file under the terms of the GNU General
 * Public License, Version 3, as published by the Free Software
 * Foundation.  You should have received a copy of the GNU
 * General Public License, Version 3 along with this program;
 * if not, write to the Free Software Foundation, Inc., 51
 * Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * 2. For the Magnolia Network Agreement (MNA), this file
 * and the accompanying materials are made available under the
 * terms of the MNA which accompanies this distribution, and
 * is available at http://www.magnolia-cms.com/mna.html
 *
 * Any modifications to this file must keep this entire header
 * intact.
 *
 */
package edu.txstate.its.gato;


import info.magnolia.pages.app.editor.ComponentContentClipboard;
import info.magnolia.pages.app.editor.PageEditorPresenter;
import info.magnolia.ui.vaadin.gwt.client.shared.AbstractElement;
import info.magnolia.ui.vaadin.gwt.client.shared.AreaElement;
import info.magnolia.pages.app.editor.availability.AbstractElementAvailabilityRule;
import info.magnolia.ui.vaadin.gwt.client.shared.ComponentElement;
import info.magnolia.rendering.template.registry.TemplateDefinitionRegistry;

import javax.inject.Inject;


/**
 * Rule for checking if a component can be pasted to a selected target area.
 */
public class GatoPasteComponentAvailability extends AbstractElementAvailabilityRule<AbstractElement> {

    private final ComponentContentClipboard componentContentClipboard;
    private final TemplateDefinitionRegistry templateDefinitionRegistry;

    @Inject
    public GatoPasteComponentAvailability(final PageEditorPresenter pageEditorPresenter, final ComponentContentClipboard componentContentClipboard, final TemplateDefinitionRegistry templateDefinitionRegistry) {
        super(pageEditorPresenter, AbstractElement.class);
        this.componentContentClipboard = componentContentClipboard;
        this.templateDefinitionRegistry = templateDefinitionRegistry;
    }


    @Override
    protected boolean isAvailableForElement(AbstractElement element) {

      if (element instanceof ComponentElement) {
        ComponentElement component = (ComponentElement)element;
        element = ElementUtil.getParent(component, templateDefinitionRegistry);
      }
      return componentContentClipboard.canPasteInto(element);
    }
}
