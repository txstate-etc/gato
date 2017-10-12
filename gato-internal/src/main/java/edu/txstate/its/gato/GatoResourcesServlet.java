package edu.txstate.its.gato;

import info.magnolia.context.SystemContext;
import info.magnolia.module.resources.ResourcesServlet;
import info.magnolia.module.resources.ResourceLinker;
import info.magnolia.repository.RepositoryConstants;
import info.magnolia.resourceloader.Resource;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.inject.Inject;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GatoResourcesServlet extends ResourcesServlet {
	private static Logger log = LoggerFactory.getLogger(GatoResourcesServlet.class);
  protected final SystemContext sc;

  @Inject
  public GatoResourcesServlet(final SystemContext syscontext, ResourceLinker linker) {
    super(linker);
    this.sc = syscontext;
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
    try {
      String etag = sc.getJCRSession(RepositoryConstants.CONFIG).getProperty("/modules/gato-internal/cachebuster").getString();
      String etag_given = request.getHeader("If-None-Match");

      if (!StringUtils.isBlank(etag) && StringUtils.trim(etag).equals(StringUtils.trim(etag_given))) {
        response.setStatus(HttpServletResponse.SC_NOT_MODIFIED);
        return;
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    super.doGet(request, response);
  }

  @Override
  protected void serveResource(HttpServletResponse response, Resource resource) throws IOException {
    try {
      String etag = sc.getJCRSession(RepositoryConstants.CONFIG).getProperty("/modules/gato-internal/cachebuster").getString();
      if (!StringUtils.isBlank(etag)) response.addHeader("ETag", etag);
    } catch (Exception e) {
      e.printStackTrace();
    }
    super.serveResource(response, resource);
  }
}
