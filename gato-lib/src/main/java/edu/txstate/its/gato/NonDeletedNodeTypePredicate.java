/**
 * This file Copyright (c) 2011-2015 Magnolia International
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

import info.magnolia.jcr.predicate.NodeTypePredicate;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Predicate filtering based on the primary type of the node and whether it's deleted.
 */
public class NonDeletedNodeTypePredicate extends NodeTypePredicate {

    private static final Logger log = LoggerFactory.getLogger(NodeTypePredicate.class);

    public NonDeletedNodeTypePredicate(String primaryNodeType) {
        super(primaryNodeType, false);
    }

    public NonDeletedNodeTypePredicate(String primaryNodeType, boolean evaluateSupertypes) {
        super(primaryNodeType, evaluateSupertypes);        
    }

    @Override
    public boolean evaluateTyped(Node t) {
        try {
            if (NodeUtil.hasMixin(t, NodeTypes.Deleted.NAME)) {
                return false;
            }
            return super.evaluateTyped(t);
        } catch (RepositoryException e) {
            log.error("Failed to read mixins of node {}", t);
            return false;
        }
    }
}
