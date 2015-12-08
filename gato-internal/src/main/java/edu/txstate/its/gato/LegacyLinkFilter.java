package edu.txstate.its.gato;

import edu.txstate.its.gato.setup.LinkMigrationLogic;

import javax.inject.Inject;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import info.magnolia.cms.filters.AbstractMgnlFilter;
import info.magnolia.dam.templating.functions.DamTemplatingFunctions;

import javax.jcr.Node;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LegacyLinkFilter extends AbstractMgnlFilter {
	private static Logger log = LoggerFactory.getLogger(AudienceViewFilter.class);
	protected final LinkMigrationLogic lmlogic;
	protected final DamTemplatingFunctions damfn;

	@Inject
  public LegacyLinkFilter(LinkMigrationLogic linklogic, DamTemplatingFunctions dtFunc) {
    this.lmlogic = linklogic;
    this.damfn = dtFunc;
  }

	public void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
	throws IOException, ServletException {
	  lmlogic.setMigrationEnabled(false);
	  Node damItem = lmlogic.convertAnyUrlToDamNode(request.getServletPath());
	  if (damItem != null) response.sendRedirect(damfn.getAssetLink(lmlogic.itemKeyForAssetNode(damItem)));
		else chain.doFilter(request, response);
	}
}
