package edu.txstate.its.gato;

import edu.txstate.its.gato.setup.LinkMigrationLogic;

import javax.inject.Inject;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import info.magnolia.cms.filters.AbstractMgnlFilter;
import info.magnolia.context.MgnlContext;
import info.magnolia.dam.templating.functions.DamTemplatingFunctions;

import javax.jcr.Node;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LegacyLinkFilter extends AbstractMgnlFilter {
	private static Logger log = LoggerFactory.getLogger(LegacyLinkFilter.class);
	protected final LinkMigrationLogic lmlogic;
	protected final DamTemplatingFunctions damfn;
	protected final GatoUtils gf;

	@Inject
  public LegacyLinkFilter(LinkMigrationLogic linklogic, DamTemplatingFunctions dtFunc, GatoUtils gatoUtils) {
    this.lmlogic = linklogic;
    this.damfn = dtFunc;
    this.gf = gatoUtils;
  }

	public void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
	throws IOException, ServletException {
	  lmlogic.setMigrationEnabled(false);
	  Node damItem = lmlogic.convertAnyUrlToDamNode(request.getServletPath());
	  if (damItem != null) {
	    String redirUrl = gf.absoluteDamUrl(lmlogic.itemKeyForAssetNode(damItem));
	    log.warn("redirecting request from "+request.getServletPath()+" to "+redirUrl);
	    log.warn("referer: "+request.getHeader("Referer"));
	    response.sendRedirect(redirUrl);
	  }
		else chain.doFilter(request, response);
	}
}
