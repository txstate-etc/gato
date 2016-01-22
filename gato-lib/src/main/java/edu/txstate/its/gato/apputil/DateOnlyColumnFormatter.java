/**
 * This file Copyright (c) 2012-2015 Magnolia International
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
package edu.txstate.its.gato.apputil; 

import info.magnolia.context.MgnlContext;
import info.magnolia.ui.workbench.column.AbstractColumnFormatter;
import info.magnolia.ui.workbench.column.definition.AbstractColumnDefinition;

import java.util.Date;
import java.util.Locale;

import javax.inject.Inject;

import org.apache.commons.lang3.time.FastDateFormat;

import com.vaadin.data.Item;
import com.vaadin.data.Property;
import com.vaadin.ui.Table;

/**
 * Formats a column's value as a date in a compact form. 
 * Duplicated from Magnolia's DateColumnFormatter with the time formatting removed.
 */
public class DateOnlyColumnFormatter extends AbstractColumnFormatter<AbstractColumnDefinition> {

    private final FastDateFormat dateFormatter;

    @Inject
    public DateOnlyColumnFormatter(AbstractColumnDefinition definition) {
        super(definition);

        final Locale locale = MgnlContext.getLocale();
        dateFormatter = FastDateFormat.getDateInstance(FastDateFormat.MEDIUM, locale);
    }

    @Override
    public Object generateCell(Table source, Object itemId, Object columnId) {
        Item item = source.getItem(itemId);
        Property prop = (item == null) ? null : item.getItemProperty(columnId);

        // Need to check prop.getValue() before prop.getType() to avoid nullpointerexception if value is null.
        if (prop != null && prop.getValue() != null && prop.getType().equals(Date.class)) {
            String date = dateFormatter.format(prop.getValue());
            return String.format("<span class=\"datetimefield\"><span class=\"datefield\">%s</span></span>", date);
        }

        return null;
    }
}
