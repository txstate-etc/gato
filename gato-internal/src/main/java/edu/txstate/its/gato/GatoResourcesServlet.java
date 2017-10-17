package edu.txstate.its.gato;

import info.magnolia.context.SystemContext;
import info.magnolia.module.resources.ResourcesServlet;
import info.magnolia.module.resources.ResourceLinker;
import info.magnolia.repository.RepositoryConstants;
import info.magnolia.resourceloader.Resource;

import io.bit3.jsass.Compiler;
import io.bit3.jsass.Options;
import io.bit3.jsass.Output;
import io.bit3.jsass.OutputStyle;

import java.io.IOException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.inject.Inject;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GatoResourcesServlet extends ResourcesServlet {
	private static Logger log = LoggerFactory.getLogger(GatoResourcesServlet.class);
  protected final SystemContext sc;
  protected final ResourceLinker ln;
  protected final Compiler compiler;
  protected final Options options;

  @Inject
  public GatoResourcesServlet(final SystemContext syscontext, ResourceLinker linker) {
    super(linker);
    this.ln = linker;
    this.sc = syscontext;
    this.compiler = new Compiler();
    this.options = new Options();
    this.options.getImporters().add(new GatoSassImporter(this.ln));
    this.options.setOutputStyle(OutputStyle.COMPRESSED);
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

      final String extension = StringUtils.substringAfterLast(resource.getName(), ".");
      if (extension.equals("scss")) {
        URI inputuri = new URI(resource.getPath());
        Output output = this.compiler.compileString(IOUtils.toString(resource.openReader()), new URI("/"), inputuri, this.options);
        response.setContentType("text/css");
        IOUtils.write(output.getCss(), response.getOutputStream(), StandardCharsets.UTF_8);
        response.getOutputStream().flush();
        return;
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    super.serveResource(response, resource);
  }
}
