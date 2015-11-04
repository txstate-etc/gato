package edu.txstate.its.gato;

import javax.inject.Inject;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import java.util.Collection;
import java.util.ArrayList;

import info.magnolia.cms.filters.AbstractMgnlFilter;
import info.magnolia.context.MgnlContext;

import javax.jcr.Node;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.commons.lang3.StringUtils;

public class AudienceViewFilter extends AbstractMgnlFilter {
	private static Logger log = LoggerFactory.getLogger(AudienceViewFilter.class);
	private final GatoUtils gf;

	@Inject
  public AudienceViewFilter(GatoUtils gatoFunctions) {
    this.gf = gatoFunctions;
  }

	public Collection<String> getProtectedGroups(Node page) {
		try {
			if (page.hasNode("protectedpagegroups")) {
				Node groups = page.getNode("protectedpagegroups");
				Collection<String> ret = gf.propertyValues(groups);
				if (!ret.isEmpty()) return ret;
			}
			if (page.getDepth() == 0) return new ArrayList();
			return getProtectedGroups(page.getParent());
		} catch (Exception e) {
			e.printStackTrace();
			return new ArrayList();
		}
	}
    /**
     * Checks the item being rendered and, if necessary, applies the
     * x-hc-authzrequiregroups header to indicate that this content
     * can only be viewed by users who are part of specific LDAP groups.
     *
     * @param request
     * @param response
     * @param chain
     * @throws java.io.IOException
     * @throws javax.servlet.ServletException
     */
	public void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
	throws IOException, ServletException {

		log.debug("BEGIN AudienceViewFilter: " + request.getRequestURL() );

		String headerValue = "";

		try {
    		Node thisPage = MgnlContext.getAggregationState().getMainContent().getJCRNode();
    		log.debug("Main Content: " + thisPage.getPath() );
				headerValue = StringUtils.join(getProtectedGroups(thisPage), ",");
		} catch ( Exception e ) {
			// couldn't get content, so let's not fool with the headers
		}
		if ( ! headerValue.equals( "" ) ) {
			response.setHeader( "x-hc-authzrequiregroups", headerValue );
		}
		log.debug("END AudienceViewFilter");
		chain.doFilter(request, response);
	}
}
