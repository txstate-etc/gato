package edu.txstate.its.gato;

import info.magnolia.context.SystemContext;
import info.magnolia.module.resources.ResourcesServlet;
import info.magnolia.module.resources.ResourceLinker;
import info.magnolia.repository.RepositoryConstants;
import info.magnolia.resourceloader.Resource;
import info.magnolia.resourceloader.ResourceChangeHandler;
import info.magnolia.resourceloader.ResourceOrigin;
import info.magnolia.resourceloader.ResourceOriginChange;

import io.bit3.jsass.Compiler;
import io.bit3.jsass.CompilationException;
import io.bit3.jsass.Options;
import io.bit3.jsass.Output;
import io.bit3.jsass.OutputStyle;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.TreeMap;
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
  protected final ResourceOrigin origin;
  protected final Compiler compiler;
  protected final Options options;
  protected final Map<String, String> cache;

  @Inject
  public GatoResourcesServlet(final SystemContext syscontext, ResourceOrigin origin, ResourceLinker linker) {
    super(linker);
    this.origin = origin;
    this.sc = syscontext;
    this.compiler = new Compiler();
    this.options = new Options();
    this.options.getImporters().add(new GatoSassImporter(this.origin));
    this.options.setOutputStyle(OutputStyle.COMPRESSED);
    this.cache = new TreeMap<String,String>();
    this.origin.registerResourceChangeHandler(new ChangeHandler(this));
  }

  protected class ChangeHandler implements ResourceChangeHandler {
    protected final GatoResourcesServlet parent;
    public ChangeHandler(final GatoResourcesServlet parent) {
      this.parent = parent;
    }
    public void onResourceChanged(ResourceOriginChange change) {
      this.parent.initialize();
    }
  }

  public void initialize() {
    this.cache.clear();
  }

  protected String compileSass(Resource resource) throws IOException, URISyntaxException, CompilationException {
    String path = resource.getPath();
    URI inputuri = new URI(path);
    Output output = this.compiler.compileString(IOUtils.toString(resource.openReader()), new URI("/"), inputuri, this.options);
    String ret = output.getCss();
    this.cache.put(path, ret);
    return ret;
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
        String key = resource.getPath();
        String cssout = this.cache.containsKey(key) ? this.cache.get(key) : compileSass(resource);
        response.setContentType("text/css");
        IOUtils.write(cssout, response.getOutputStream(), StandardCharsets.UTF_8);
        response.getOutputStream().flush();
        return;
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    super.serveResource(response, resource);
  }
}
