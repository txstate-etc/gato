/**
 * This file Copyright (c) 2014-2015 Magnolia International
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
package edu.txstate.its.gato.rest;

import info.magnolia.rest.client.ConfiguredRestClientDefinition;
import info.magnolia.resteasy.client.proxy.ClientServiceDefinition;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jboss.resteasy.client.core.ClientErrorInterceptor;

public class RestEasyClientDefinition extends info.magnolia.resteasy.client.RestEasyClientDefinition {

    private int connectionPoolSize = 0;
    private int maxPooledPerRoute = 0;
    private long connectionTTL = -1;
    private long connectionTimeout = -1;
    private long socketTimeout = -1;

    public int getConnectionPoolSize() {
        return connectionPoolSize;
    }

    public void setConnectionPoolSize(int connectionPoolSize) {
        this.connectionPoolSize = connectionPoolSize;
    }

    public int getMaxPooledPerRoute() {
        return maxPooledPerRoute;
    }

    public void setMaxPooledPerRoute(int maxPooledPerRoute) {
        this.maxPooledPerRoute = maxPooledPerRoute;
    }

    public long getConnectionTTL() {
        return connectionTTL;
    }

    public void setConnectionTTL(long connectionTTL) {
        this.connectionTTL = connectionTTL;
    }

    public long getConnectionTimeout() {
        return connectionTimeout;
    }

    public void setConnectionTimeout(long connectionTimeout) {
        this.connectionTimeout = connectionTimeout;
    }

    public long getSocketTimeout() {
        return socketTimeout;
    }

    public void setSocketTimeout(long socketTimeout) {
        this.socketTimeout = socketTimeout;
    }

}
