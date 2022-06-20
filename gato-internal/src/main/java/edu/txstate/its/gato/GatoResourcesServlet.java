package edu.txstate.its.gato;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import info.magnolia.cms.security.JCRSessionOp;
import info.magnolia.context.MgnlContext;
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

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.io.Reader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
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
  protected final GatoUtils gf;
  protected final ResourceLinker mylinker;

  @Inject
  public GatoResourcesServlet(final SystemContext syscontext, ResourceOrigin origin, ResourceLinker linker, GatoUtils gf) {
    super(linker);
    this.origin = origin;
    this.sc = syscontext;
    this.mylinker = linker;
    this.gf = gf;
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

  public synchronized void initialize() {
    this.cache.clear();
    try {
      MgnlContext.doInSystemContext(new JCRSessionOp<Boolean>("config") {
        @Override
        public Boolean exec(Session session) throws RepositoryException {
          session.getProperty("/modules/gato-internal/cachebuster").setValue(UUID.randomUUID().toString());
          session.save();
          return true;
        }
      });
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public static String readResource(Resource resource) throws IOException {
    String content = "";
    Reader reader = resource.openReader();
    try {
      content = IOUtils.toString(reader);
    } finally {
      reader.close();
    }
    return content;
  }

  protected synchronized String compileSass(Resource resource) throws IOException, URISyntaxException, CompilationException {
    String path = resource.getPath();
    if (this.cache.containsKey(path)) return this.cache.get(path);

    URI inputuri = new URI(path);
    Output output = this.compiler.compileString(GatoResourcesServlet.readResource(resource), new URI("/"), inputuri, this.options);
    String ret = output.getCss();
    this.cache.put(path, ret);
    return ret;
  }

  protected JsonArray collectFileContent(Resource resource, JsonArray ret) throws IOException {
    String cjs = GatoResourcesServlet.readResource(resource);
    String[] files = cjs.split("\\n");
    for (String file : files) {
      Resource r = this.origin.getByPath(file);
      if (file.endsWith(".cjs")) collectFileContent(r, ret);
      else {
        JsonObject fileObj = new JsonObject();
        fileObj.addProperty("name", "/.resources" + file);
        fileObj.addProperty("content", GatoResourcesServlet.readResource(r));
        ret.add(fileObj);
      }
    }
    return ret;
  }

  protected synchronized String compileCjs(Resource resource) throws IOException {
    String path = resource.getPath();
    if (this.cache.containsKey(path)) return this.cache.get(path);

    JsonObject body = new JsonObject();
    body.add("files", collectFileContent(resource, new JsonArray()));
    byte[] postBody = gf.toJSON(body).getBytes("UTF-8");
    StringBuffer jsonString = new StringBuffer();
    HttpURLConnection http = (HttpURLConnection) new URL("http://uglifyjs:3000").openConnection();
    try {
      http.setRequestMethod("POST");
      http.setDoOutput(true);
      http.setFixedLengthStreamingMode(postBody.length);
      http.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
      http.connect();
      try(OutputStream os = http.getOutputStream()) {
          os.write(postBody);
      }
      BufferedReader in = new BufferedReader(new InputStreamReader(http.getInputStream()));
      String inputLine;
      while ((inputLine = in.readLine()) != null) {
          jsonString.append(inputLine);
      }
      in.close();
    } finally {
      try {
        http.disconnect();
      } catch (Exception e) {}
    }
    JsonObject json = gf.parseJSON(jsonString.toString());
    String code = gf.jsonGetString(json, "code");
    String map = gf.jsonGetString(json, "map");
    this.cache.put(path, code);
    this.cache.put(path + ".map", map);
    return code;
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
    String path = request.getPathInfo();
    if (path.endsWith(".compiled.css")) {
      String newpath = path.replaceFirst("\\.compiled\\.css$", ".scss");
      request.setAttribute("javax.servlet.forward.path_info", newpath);
    } else if (path.endsWith(".cjs.map")) {
      final Resource resource = mylinker.getResource(path.replaceAll("\\.map$", ""));
      final String jsout = this.cache.get(resource.getPath() + ".map");
      response.setContentType("application/json");
      IOUtils.write(jsout, response.getOutputStream(), StandardCharsets.UTF_8);
      response.getOutputStream().flush();
      return;
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
        String cssout = compileSass(resource);
        response.setContentType("text/css");
        IOUtils.write(cssout, response.getOutputStream(), StandardCharsets.UTF_8);
        response.getOutputStream().flush();
        return;
      } else if (extension.equals("cjs")) {
        String jsout = "//# sourceMappingURL=" + gf.resourcePath() + resource.getPath() + resource.getName() + ".map\n" + compileCjs(resource);
        response.setContentType("application/javascript");
        IOUtils.write(jsout, response.getOutputStream(), StandardCharsets.UTF_8);
        response.getOutputStream().flush();
        return;
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    super.serveResource(response, resource);
  }
}
