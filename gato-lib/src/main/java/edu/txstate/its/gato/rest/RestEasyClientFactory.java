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

import info.magnolia.rest.client.RestClient;
import info.magnolia.rest.client.factory.ClientFactory;
import info.magnolia.resteasy.client.RestEasyClient;

import java.util.concurrent.TimeUnit;

import javax.ws.rs.client.ClientRequestFilter;
import javax.ws.rs.client.ClientResponseFilter;

import org.apache.http.client.HttpClient;
import org.apache.http.conn.ClientConnectionManager;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.PoolingClientConnectionManager;
import org.jboss.resteasy.client.core.ClientErrorInterceptor;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.resteasy.client.jaxrs.cache.BrowserCacheFeature;
import org.jboss.resteasy.client.jaxrs.engines.ApacheHttpClient4Engine;
import org.jboss.resteasy.spi.ResteasyProviderFactory;

import com.google.inject.Inject;

/**
 * Factory that creates {@link RestEasyClient}.
 * Copied from Magnolia to add some config options
 */
public class RestEasyClientFactory implements ClientFactory {

    private RestEasyClientDefinition definition;

    @Inject
    public RestEasyClientFactory(RestEasyClientDefinition definition) {
        this.definition = definition;
    }

    @Override
    public RestClient createClient() {
        ResteasyClient client = ((ResteasyClientBuilder) ResteasyClientBuilder.newBuilder())
        .connectionPoolSize(definition.getConnectionPoolSize())
        .maxPooledPerRoute(definition.getMaxPooledPerRoute())
        .connectionTTL(definition.getConnectionTTL(), TimeUnit.SECONDS)
        .establishConnectionTimeout(definition.getConnectionTimeout(), TimeUnit.SECONDS)
        .socketTimeout(definition.getSocketTimeout(), TimeUnit.SECONDS)
        .build();
        for (Object clientFilter : definition.getClientFilters()) {
            if (clientFilter instanceof ClientRequestFilter || clientFilter instanceof ClientResponseFilter) {
                client.register(clientFilter);
            }
        }
        ResteasyWebTarget target = client.target(definition.getBaseUrl());
        ResteasyProviderFactory pf = ResteasyProviderFactory.getInstance();
        for (ClientErrorInterceptor handler : definition.getClientErrorInterceptors()) {
            pf.addClientErrorInterceptor(handler);
        }
        if (definition.isCacheable()) {
            target.register(BrowserCacheFeature.class);
        }
        return new RestEasyClient(target, definition);
    }
}
